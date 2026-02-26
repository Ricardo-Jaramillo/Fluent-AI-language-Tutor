"""WebSocket handler for streaming conversation."""

import json
from fastapi import WebSocket, WebSocketDisconnect

from app.llm.base import ChatMessage
from app.llm.factory import create_provider


class ConversationHandler:
    """Handles a WebSocket conversation session.

    Protocol:
    - Client sends JSON: {"type": "message", "content": "...", "provider": "deepseek"}
    - Client sends JSON: {"type": "audio", "data": "<base64>"}
    - Server sends JSON: {"type": "response", "content": "..."}
    - Server sends JSON: {"type": "error", "detail": "..."}
    - Server sends JSON: {"type": "ipa", "analysis": {...}}
    """

    def __init__(self, websocket: WebSocket):
        self.websocket = websocket
        self.messages: list[ChatMessage] = []
        self.system_prompt = (
            "Du bist ein freundlicher Deutsch-Lehrer. "
            "Sprich immer auf Deutsch. Passe dein Niveau an den Schüler an. "
            "Korrigiere Fehler sanft und ermutige den Schüler."
        )
        self.messages.append(ChatMessage(role="system", content=self.system_prompt))

    async def handle(self):
        """Main WebSocket loop."""
        await self.websocket.accept()

        try:
            while True:
                raw = await self.websocket.receive_text()
                data = json.loads(raw)
                msg_type = data.get("type")

                if msg_type == "message":
                    await self._handle_text_message(data)
                elif msg_type == "config":
                    await self._handle_config(data)
                elif msg_type == "ping":
                    await self.websocket.send_json({"type": "pong"})
                else:
                    await self.websocket.send_json({
                        "type": "error",
                        "detail": f"Unknown message type: {msg_type}",
                    })

        except WebSocketDisconnect:
            pass
        except json.JSONDecodeError:
            await self.websocket.send_json({
                "type": "error",
                "detail": "Invalid JSON",
            })

    async def _handle_text_message(self, data: dict):
        """Process a text message from the user."""
        content = data.get("content", "")
        provider_name = data.get("provider")

        self.messages.append(ChatMessage(role="user", content=content))

        try:
            provider = create_provider(provider_name)
            response = await provider.chat(self.messages)
            self.messages.append(ChatMessage(role="assistant", content=response.content))

            await self.websocket.send_json({
                "type": "response",
                "content": response.content,
                "provider": response.provider,
                "model": response.model,
            })
        except Exception as e:
            await self.websocket.send_json({
                "type": "error",
                "detail": str(e),
            })

    async def _handle_config(self, data: dict):
        """Handle configuration updates (e.g., system prompt, level)."""
        if "system_prompt" in data:
            self.system_prompt = data["system_prompt"]
            self.messages[0] = ChatMessage(role="system", content=self.system_prompt)

        await self.websocket.send_json({"type": "config_ack"})

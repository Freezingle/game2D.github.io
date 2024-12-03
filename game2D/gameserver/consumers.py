import json
from channels.generic.websocket import WebsocketConsumer
from asgiref.sync import async_to_sync


class GameConsumer(WebsocketConsumer):
    def connect(self):
        self.player_id = self.channel_name  
        self.group_name = "game_group"
        async_to_sync(self.channel_layer.group_add)(
            self.group_name,
            self.channel_name,
        )
        self.accept()

    def disconnect(self, close_code):
        async_to_sync(self.channel_layer.group_discard)(
            self.group_name, self.channel_name
        )

    def receive(self, text_data):
        text_data_json = json.loads(text_data)
        
        event_type = text_data_json["type"]
        key = text_data_json["key"]
        
        async_to_sync(self.channel_layer.group_send)(
            self.group_name,
            {
                "type": "game_event",
                "id": self.player_id,
                "event_type": event_type,
                "key": key
            }
        )

    def game_event(self, event):
        event_type = event["event_type"]
        key = event["key"]
        sender_id = event["id"]
        if sender_id == self.player_id:
            return
        self.send(text_data=json.dumps({
            "type": event_type,
            "key": key
        }))
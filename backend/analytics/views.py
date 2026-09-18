from rest_framework import status
from rest_framework.parsers import JSONParser
from rest_framework.response import Response
from rest_framework.throttling import ScopedRateThrottle
from rest_framework.views import APIView

from .serializers import EventSerializer


class PlainTextJSONParser(JSONParser):
    """navigator.sendBeacon은 JSON을 text/plain으로 보내므로 함께 받는다."""

    media_type = "text/plain"


class EventCreateView(APIView):
    """POST /api/events/ — page_view, cta_click 이벤트 기록."""

    parser_classes = [JSONParser, PlainTextJSONParser]
    throttle_classes = [ScopedRateThrottle]
    throttle_scope = "event"

    def post(self, request):
        serializer = EventSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        serializer.save()
        return Response(status=status.HTTP_204_NO_CONTENT)

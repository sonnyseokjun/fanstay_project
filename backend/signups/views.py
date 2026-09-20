from django.db import IntegrityError, transaction
from rest_framework import status
from rest_framework.response import Response
from rest_framework.throttling import ScopedRateThrottle
from rest_framework.views import APIView

from .models import PreRegistration
from .serializers import PreRegistrationSerializer


class PreRegistrationCreateView(APIView):
    """POST /api/signups/ — 사전가입을 저장하고 대기 순번을 돌려준다.

    같은 이메일로 다시 가입하면 새로 만들지 않고 기존 순번을 돌려준다(created=false).
    """

    throttle_classes = [ScopedRateThrottle]
    throttle_scope = "signup"

    def post(self, request):
        serializer = PreRegistrationSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        data = serializer.validated_data

        existing = self._find_existing(data)
        if existing:
            return Response({"position": existing.position, "created": False}, status=status.HTTP_200_OK)

        try:
            with transaction.atomic():
                signup = serializer.save()
        except IntegrityError:
            # 같은 이메일이 동시에 들어온 경우
            existing = self._find_existing(data)
            return Response({"position": existing.position, "created": False}, status=status.HTTP_200_OK)

        return Response({"position": signup.position, "created": True}, status=status.HTTP_201_CREATED)

    @staticmethod
    def _find_existing(data):
        return PreRegistration.objects.filter(email=data["email"]).first()

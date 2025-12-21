from rest_framework import viewsets
from rest_framework.permissions import IsAuthenticated
from .models import User
from .serializers import UserSerializer
from pokevault.permissions import IsGerente

class UserViewSet(viewsets.ModelViewSet):
    """
    CRUD de Usuários. Apenas Gerentes podem manipular.
    """
    queryset = User.objects.all()
    serializer_class = UserSerializer
    permission_classes = [IsAuthenticated, IsGerente]
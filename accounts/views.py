from rest_framework import viewsets
from rest_framework.decorators import api_view, permission_classes, action
from rest_framework.response import Response
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

    @action(detail=False, methods=['get'], permission_classes=[IsAuthenticated])
    def me(self, request):
        """Retorna o perfil do usuário autenticado (qualquer role)."""
        serializer = self.get_serializer(request.user)
        return Response(serializer.data)
from rest_framework import viewsets
from rest_framework.decorators import action, api_view, permission_classes
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from django.db import models
from drf_spectacular.utils import extend_schema, OpenApiTypes
from .models import Categoria, Item, Transacao
from .serializers import CategoriaSerializer, ItemSerializer, TransacaoSerializer
from .services import gerar_analise_tendencias
from pokevault.permissions import IsGerente

class CategoriaViewSet(viewsets.ModelViewSet):
    queryset = Categoria.objects.all()
    serializer_class = CategoriaSerializer
    permission_classes = [IsAuthenticated]

class ItemViewSet(viewsets.ModelViewSet):
    queryset = Item.objects.all()
    serializer_class = ItemSerializer
    permission_classes = [IsAuthenticated]

    @action(detail=False, methods=['get'])
    def estoque_baixo(self, request):
        itens = Item.objects.filter(quantidade__lte=models.F('limite_minimo'))
        serializer = self.get_serializer(itens, many=True)
        return Response(serializer.data)

class TransacaoViewSet(viewsets.ModelViewSet):
    queryset = Transacao.objects.all().order_by('-data_hora')
    serializer_class = TransacaoSerializer
    permission_classes = [IsAuthenticated]

    def perform_create(self, serializer):
        serializer.save(usuario=self.request.user)

@extend_schema(responses={200: OpenApiTypes.OBJECT})
@api_view(['GET'])
@permission_classes([IsAuthenticated])
def dashboard_stats(request):
    total_itens = Item.objects.count()
    itens_criticos = Item.objects.filter(quantidade__lte=10).count()
    movimentacoes_hoje = Transacao.objects.filter(data_hora__date=models.functions.Now().date()).count()
    
    return Response({
        "total_itens": total_itens,
        "itens_criticos": itens_criticos,
        "movimentacoes_hoje": movimentacoes_hoje
    })

@extend_schema(
    request=None,
    responses={200: OpenApiTypes.OBJECT},
    description="Gera análise de tendências usando IA baseada nas últimas transações."
)
@api_view(['POST'])
@permission_classes([IsAuthenticated, IsGerente])
def analise_ia(request):
    resultado = gerar_analise_tendencias()
    return Response(resultado)
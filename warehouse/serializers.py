from rest_framework import serializers
from drf_spectacular.utils import extend_schema_field
from .models import Categoria, Item, Transacao

class CategoriaSerializer(serializers.ModelSerializer):
    class Meta:
        model = Categoria
        fields = '__all__'

class ItemSerializer(serializers.ModelSerializer):
    status_estoque = serializers.SerializerMethodField()
    categoria_nome = serializers.CharField(source='categoria.nome', read_only=True)

    class Meta:
        model = Item
        fields = ['id', 'nome', 'categoria', 'categoria_nome', 'quantidade', 'limite_minimo', 'preco_unitario', 'imagem', 'status_estoque', 'created_at']

    @extend_schema_field(str)
    def get_status_estoque(self, obj):
        if obj.quantidade <= obj.limite_minimo:
            return "CRITICO"
        return "OK"

class TransacaoSerializer(serializers.ModelSerializer):
    item_nome = serializers.CharField(source='item.nome', read_only=True)
    usuario_nome = serializers.CharField(source='usuario.first_name', read_only=True)

    class Meta:
        model = Transacao
        fields = ['id', 'tipo', 'item', 'item_nome', 'quantidade', 'usuario', 'usuario_nome', 'data_hora', 'observacao']
        read_only_fields = ['usuario']
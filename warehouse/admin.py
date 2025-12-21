from django.contrib import admin
from .models import Categoria, Item, Transacao

@admin.register(Categoria)
class CategoriaAdmin(admin.ModelAdmin):
    list_display = ('nome', 'descricao')
    search_fields = ('nome',)

@admin.register(Item)
class ItemAdmin(admin.ModelAdmin):
    list_display = ('nome', 'categoria', 'quantidade', 'limite_minimo', 'status_estoque_visual', 'preco_unitario')
    list_filter = ('categoria',)
    search_fields = ('nome',)
        
    def status_estoque_visual(self, obj):
        return obj.is_estoque_baixo
    status_estoque_visual.boolean = True
    status_estoque_visual.short_description = 'Estoque Baixo?'

@admin.register(Transacao)
class TransacaoAdmin(admin.ModelAdmin):
    list_display = ('data_hora', 'tipo', 'item', 'quantidade', 'usuario')
    list_filter = ('tipo', 'data_hora')
    search_fields = ('item__nome', 'usuario__email')
        
    def has_change_permission(self, request, obj=None):
        return False
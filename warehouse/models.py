from django.db import models
from django.conf import settings

class Categoria(models.Model):
    nome = models.CharField(max_length=100)
    descricao = models.TextField(blank=True)

    def __str__(self):
        return self.nome

class Item(models.Model):
    nome = models.CharField(max_length=150)
    categoria = models.ForeignKey(Categoria, on_delete=models.PROTECT, related_name='itens')
    quantidade = models.IntegerField(default=0)
    limite_minimo = models.IntegerField(default=10)
    preco_unitario = models.DecimalField(max_digits=10, decimal_places=2)
    imagem = models.ImageField(upload_to='itens/', null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return self.nome

    @property
    def is_estoque_baixo(self):
        return self.quantidade <= self.limite_minimo

class Transacao(models.Model):
    TIPO_CHOICES = (
        ('ENTRADA', 'Entrada'),
        ('SAIDA', 'Saída'),
    )

    item = models.ForeignKey(Item, on_delete=models.CASCADE, related_name='transacoes')
    usuario = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.PROTECT)
    tipo = models.CharField(max_length=10, choices=TIPO_CHOICES)
    quantidade = models.PositiveIntegerField()
    data_hora = models.DateTimeField(auto_now_add=True)
    observacao = models.TextField(blank=True, null=True)

    def __str__(self):
        return f"{self.tipo} - {self.item.nome} - {self.quantidade}"
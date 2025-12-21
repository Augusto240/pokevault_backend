from django.db.models.signals import pre_save, post_save
from django.dispatch import receiver
from django.core.exceptions import ValidationError
from .models import Transacao

@receiver(pre_save, sender=Transacao)
def validar_estoque(sender, instance, **kwargs):
    if instance.tipo == 'SAIDA':
        if instance.pk:
            old_instance = Transacao.objects.get(pk=instance.pk)
            ajuste = instance.quantidade - old_instance.quantidade
            if instance.item.quantidade < ajuste:
                 raise ValidationError("Estoque insuficiente para esta atualização de saída.")
        else:
            if instance.item.quantidade < instance.quantidade:
                raise ValidationError(f"Estoque insuficiente. Disponível: {instance.item.quantidade}")

@receiver(post_save, sender=Transacao)
def atualizar_saldo_estoque(sender, instance, created, **kwargs):
    item = instance.item
    
    if created:
        if instance.tipo == 'ENTRADA':
            item.quantidade += instance.quantidade
        else:
            item.quantidade -= instance.quantidade
        item.save()
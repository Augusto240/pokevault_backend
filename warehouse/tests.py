from django.test import TestCase
from django.core.exceptions import ValidationError
from accounts.models import User
from warehouse.models import Categoria, Item, Transacao

class RegrasNegocioTestCase(TestCase):
    def setUp(self):
  
        self.user = User.objects.create_user(username='testuser', email='test@pv.com', password='123', matricula='000')
        self.categoria = Categoria.objects.create(nome='Teste')
        self.item = Item.objects.create(
            nome='Potion Teste', 
            categoria=self.categoria, 
            quantidade=100,  
            limite_minimo=10, 
            preco_unitario=10.0
        )

    def test_rf008_entrada_aumenta_estoque(self):
        """Testa se uma transação de ENTRADA aumenta o saldo automaticamente"""
        Transacao.objects.create(
            item=self.item, usuario=self.user, tipo='ENTRADA', quantidade=50
        )
        self.item.refresh_from_db() 
        self.assertEqual(self.item.quantidade, 150) 
        
    def test_rf008_saida_diminui_estoque(self):
        """Testa se uma transação de SAIDA diminui o saldo automaticamente"""
        Transacao.objects.create(
            item=self.item, usuario=self.user, tipo='SAIDA', quantidade=30
        )
        self.item.refresh_from_db()
        self.assertEqual(self.item.quantidade, 70) 

    def test_rnf006_bloquear_estoque_negativo(self):
        """Testa se o sistema BLOQUEIA uma saída maior que o saldo disponível"""
        with self.assertRaises(ValidationError):
            Transacao.objects.create(
                item=self.item, 
                usuario=self.user, 
                tipo='SAIDA', 
                quantidade=101 
            )
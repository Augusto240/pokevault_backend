import os
import django
import random

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'pokevault.settings')
django.setup()

from accounts.models import User
from warehouse.models import Categoria, Item, Transacao

def populate():
    print("Iniciando população do PokéVault...")

    if not User.objects.filter(email='ash@pokevault.com').exists():
        user = User.objects.create_user(
            username='ashketchum',
            email='ash@pokevault.com',
            password='pikachubestfriend',
            first_name='Ash',
            last_name='Ketchum',
            matricula='2024001',
            role='ESTOQUISTA'
        )
        print(f"✅ Usuário criado: {user.email} (Estoquista)")
    else:
        print("ℹ️ Usuário Ash já existe.")

    # 2. Criar Categorias
    categorias = ['Pokébolas', 'Poções', 'Berries', 'TMs/HMs', 'Itens de Batalha']
    objs_cat = []
    for nome in categorias:
        cat, created = Categoria.objects.get_or_create(
            nome=nome, 
            defaults={'descricao': f'Categoria destinada a {nome}'}
        )
        objs_cat.append(cat)
        if created: print(f"✅ Categoria criada: {nome}")

    # 3. Criar Itens
    itens_data = [
        ('Poké Ball', 0, 50, 200.00),
        ('Great Ball', 0, 30, 600.00),
        ('Ultra Ball', 0, 15, 1200.00),
        ('Potion', 1, 50, 300.00),
        ('Super Potion', 1, 30, 700.00),
        ('Hyper Potion', 1, 20, 1200.00),
        ('Oran Berry', 2, 100, 50.00),
        ('Lum Berry', 2, 80, 80.00),
        ('X Attack', 4, 10, 500.00),
    ]

    for nome, cat_idx, limite, preco in itens_data:
        item, created = Item.objects.get_or_create(
            nome=nome,
            defaults={
                'categoria': objs_cat[cat_idx],
                'quantidade': random.randint(5, 100), 
                'limite_minimo': limite,
                'preco_unitario': preco
            }
        )
        if created: print(f"✅ Item criado: {nome}")

    print("População concluída com sucesso! 🚀")

if __name__ == '__main__':
    populate()
# Generated by Django 4.0.5 on 2022-06-08 13:43

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('api', '0003_alter_game_creator_alter_game_opponent_and_more'),
    ]

    operations = [
        migrations.AddField(
            model_name='game',
            name='is_private',
            field=models.BooleanField(default=False),
        ),
    ]

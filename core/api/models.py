from django.db import models
from django.contrib.auth import get_user_model
from django.dispatch import receiver
from django.db.models.signals import post_save
from rest_framework.authtoken.models import Token
from django.db.models import Q

User = get_user_model()

class Game(models.Model):
    creator = models.ForeignKey(User, on_delete=models.CASCADE, related_name="creator")
    opponent = models.ForeignKey(User, on_delete=models.CASCADE, blank=True, related_name="opponent", null=True)
    access_code = models.CharField(max_length=6)
    created = models.DateTimeField(auto_now_add=True)
    winner = models.ForeignKey(User, on_delete=models.CASCADE, blank=True, related_name="winner", null=True)
    is_private = models.BooleanField(default=False)

    def __str__(self) -> str:
        return self.creator.username + ' vs ' + (self.opponent.username if self.opponent else "")

    @property
    def score(self):
        if self.opponent:
            qs = Game.objects.filter(
                (Q(creator=self.creator) & Q(opponent=self.opponent)) | (Q(creator=self.opponent) & Q(opponent=self.creator)))
            
            hosts_wins = qs.filter(winner=self.creator).count()
            guests_wins = qs.filter(winner=self.opponent).count()

            return str(hosts_wins) + '-' + str(guests_wins)

@receiver(post_save, sender=User)
def create_auth_token(sender, instance, created, *args, **kwargs):
    if created:
        Token.objects.create(user=instance)

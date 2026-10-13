# language: fr
@api @smoke @feature:API
Fonctionnalité: Disponibilité de l'API
  En tant que consommateur de l'API
  Je veux qu'elle réponde aux requêtes
  Afin de pouvoir l'utiliser

  @story:Disponibilité @severity:blocker
  Scénario: L'API répond
    Quand j'envoie une requête GET sur "/"
    Alors l'API répond sans erreur serveur

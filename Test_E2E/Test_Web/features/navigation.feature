# language: fr
@navigation @regression @feature:Navigation
Fonctionnalité: Navigation
  En tant que visiteur
  Je veux être informé lorsqu'une page n'existe pas
  Afin de comprendre que l'adresse saisie est erronée

  @story:Page_introuvable @severity:major
  Scénario: Une URL inexistante renvoie une erreur 404
    Quand le visiteur ouvre une URL inexistante
    Alors la page répond avec le statut 404

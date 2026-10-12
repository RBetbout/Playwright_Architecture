# language: fr
@bdd @smoke @feature:Accueil @story:Accès_à_la_page @severity:blocker
Fonctionnalité: Accès à la page d'accueil
  En tant que visiteur
  Je veux accéder à la page d'accueil
  Afin de commencer ma navigation sur le site

  Scénario: La page d'accueil est accessible
    Quand le visiteur ouvre la page d'accueil
    Alors la page d'accueil répond sans erreur
    Et la page possède un titre
    Et l'en-tête du site est visible

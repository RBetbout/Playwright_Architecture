# language: fr
@smoke @feature:Accueil
Fonctionnalité: Accès à la page d'accueil
  En tant que visiteur
  Je veux accéder à la page d'accueil
  Afin de commencer ma navigation sur le site

  @story:Accès_à_la_page @severity:blocker
  Scénario: La page d'accueil est accessible
    Quand le visiteur ouvre la page d'accueil
    Alors la page répond sans erreur
    Et la page possède un titre
    Et l'en-tête du site est visible

  @story:Structure_de_la_page @severity:critical
  Scénario: Les zones principales sont affichées
    Quand le visiteur ouvre la page d'accueil
    Alors l'en-tête du site est visible
    Et le titre principal est visible
    Et le pied de page est visible

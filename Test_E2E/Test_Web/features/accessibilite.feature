# language: fr
@a11y @feature:Accessibilité @severity:major
Fonctionnalité: Accessibilité WCAG 2.1 AA
  En tant que visiteur en situation de handicap
  Je veux des pages conformes au référentiel WCAG 2.1 AA
  Afin de pouvoir utiliser le site

  Plan du Scénario: <page> : aucune violation bloquante
    Quand le visiteur ouvre la page "<page>"
    Alors la page ne présente aucune violation d'accessibilité bloquante

    @story:Accueil
    Exemples:
      | page    |
      | Accueil |

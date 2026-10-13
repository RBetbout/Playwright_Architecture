# language: fr
@seo @feature:SEO @severity:minor
Fonctionnalité: SEO technique
  En tant que responsable du référencement
  Je veux que les pages exposent les éléments attendus par les moteurs de recherche
  Afin que le site soit correctement indexé

  @story:Balises
  Plan du Scénario: <page> : balises essentielles présentes
    Quand le visiteur ouvre la page "<page>"
    Alors les balises SEO essentielles sont présentes

    Exemples:
      | page    |
      | Accueil |

  @story:Fichiers_d_indexation
  Plan du Scénario: <fichier> est accessible
    Alors le fichier d'indexation "<fichier>" est accessible

    Exemples:
      | fichier     |
      | robots.txt  |
      | sitemap.xml |

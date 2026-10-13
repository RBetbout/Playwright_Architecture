# language: fr
@links @regression @feature:Liens
Fonctionnalité: Liens des pages
  En tant que visiteur
  Je veux que les liens des pages fonctionnent
  Afin de ne pas aboutir sur une page en erreur

  @story:Liens_internes @severity:critical
  Plan du Scénario: <page> : aucun lien interne cassé
    Quand le visiteur ouvre la page "<page>"
    Et les liens internes de la page sont vérifiés
    Alors aucun lien interne n'est cassé

    Exemples:
      | page    |
      | Accueil |

  @story:Liens_externes @severity:minor
  Plan du Scénario: <page> : aucun lien externe inaccessible
    Quand le visiteur ouvre la page "<page>"
    Et les liens externes de la page sont vérifiés
    Alors aucun lien externe n'est inaccessible

    Exemples:
      | page    |
      | Accueil |

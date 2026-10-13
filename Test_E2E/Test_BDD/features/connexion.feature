# language: fr
@bd @smoke @feature:Base_de_données
Fonctionnalité: Connexion à la base de données
  En tant que testeur
  Je veux interroger la base de l'application
  Afin de vérifier les données qu'elle enregistre

  @story:Connexion @severity:blocker
  Scénario: La base répond
    Quand j'exécute la requête SQL :
      """
      SELECT 1 AS resultat
      """
    Alors la requête retourne 1 ligne
    Et la colonne "resultat" de la première ligne vaut "1"

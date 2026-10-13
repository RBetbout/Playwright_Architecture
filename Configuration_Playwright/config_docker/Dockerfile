# Image d'exécution des tests. Le contexte de build est la racine du dépôt (voir docker-compose.yml).
# La version de l'image doit rester identique à celle de @playwright/test dans package-lock.json :
# les navigateurs préinstallés sont ceux de cette version.
FROM mcr.microsoft.com/playwright:v1.64.0-noble

WORKDIR /work

# Les dépendances sont installées avant la copie du code pour profiter du cache Docker.
COPY Configuration_Playwright/config_playwright/package.json Configuration_Playwright/config_playwright/package-lock.json Configuration_Playwright/config_playwright/
RUN npm --prefix Configuration_Playwright/config_playwright ci

COPY . .

ENV CI=true
WORKDIR /work/Configuration_Playwright/config_playwright

# Les arguments passés au conteneur sont transmis à Playwright : `... run --rm tests --grep @smoke`.
ENTRYPOINT ["npm", "test", "--"]

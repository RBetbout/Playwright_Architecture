import { UNKNOWN_PATH } from '../../Support/data/test-data';
import { When } from '../../fixtures/test.fixture';

When('le visiteur ouvre une URL inexistante', async ({ page, scenario }) => {
  scenario.lastResponse = await page.goto(UNKNOWN_PATH);
});

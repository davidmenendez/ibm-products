/**
 * Copyright IBM Corp. 2024, 2024
 *
 * This source code is licensed under the Apache-2.0 license found in the
 * LICENSE file in the root directory of this source tree.
 */

'use strict';

import { expect, test } from '@playwright/test';
import { visitStory } from '../../test-utils/storybook';
import { carbon } from '../../../packages/ibm-products/src/settings';
import { pkg } from '../../../packages/ibm-products/src/settings';
test.use({ viewport: { width: 1600, height: 900 } });

test.describe('PageHeader @avt', () => {
  test('@avt-default-state', async ({ page }) => {
    await visitStory(page, {
      component: 'PageHeader',
      id: 'components-pageheader--with-title',
      globals: {
        carbonTheme: 'white',
      },
    });
    await expect(page).toHaveNoACViolations('PageHeader @avt-default-state');
  });

  // Collapses on page scroll
  test('@avt-collapse-on-scroll', async ({ page }) => {
    await visitStory(page, {
      component: 'PageHeader',
      id: 'components-pageheader--fully-loaded-and-some',
      globals: {
        carbonTheme: 'white',
      },
    });

    const pageTitle = page.getByRole('button', {
      name: 'A very long page title with a short version in breadcrumbs; this will almost certainly be truncated at some point',
    });

    // The header starts expanded.
    await expect(pageTitle).toBeInViewport();

    // The header collapses when the page is scrolled down.
    await page.locator(`.page-header-stories__dummy-content`).first().hover();
    await page.mouse.wheel(0, 600);
    await expect(pageTitle).not.toBeInViewport();

    // The header remains collapsed even if scrolled slightly back up.
    await page.locator(`.page-header-stories__dummy-content`).first().hover();
    await page.mouse.wheel(0, -170);
    await expect(pageTitle).not.toBeInViewport();

    // The header expands again when scrolled back to the top.
    await page.locator(`.page-header-stories__dummy-content`).first().hover();
    await page.mouse.wheel(0, -700);
    await page.waitForTimeout(100);
    await expect(pageTitle).toBeInViewport();
  });

  // Starts collapsed by default
  test('@avt-collapse-by-default', async ({ page }) => {
    await visitStory(page, {
      component: 'PageHeader',
      id: 'components-pageheader--fully-loaded',
      globals: {
        carbonTheme: 'white',
      },
    });

    const pageTitle = page.getByRole('heading').getByText('Page title');

    // The header starts collapsed.
    await page.waitForTimeout(200);
    await expect(pageTitle).not.toBeInViewport();

    // The header expands when the page is scrolled to the top.
    await page.locator(`.page-header-stories__dummy-content`).first().hover();
    await page.mouse.wheel(0, -600);
    await expect(pageTitle).toBeInViewport();
  });

  // collapses/expands by toggling the cheveron button
  test('@avt-collapse-by-toggle-button', async ({ page }) => {
    await visitStory(page, {
      component: 'PageHeader',
      id: 'components-pageheader--fully-loaded-and-some',
      globals: {
        carbonTheme: 'white',
      },
    });
    const pageTitle = page.getByRole('button', {
      name: 'A very long page title with a short version in breadcrumbs; this will almost certainly be truncated at some point',
    });

    // The header starts expanded.
    await expect(pageTitle).toBeInViewport();

    // The header collapses when the cheveron button is toggled close.
    await pressTabKey(page, 20);
    await expect(page.getByLabel('Collapse the page header')).toBeFocused();
    await page.keyboard.press('Enter');
    await page.waitForTimeout(300);
    await expect(pageTitle).not.toBeInViewport();

    // The header expands when the cheveron button is toggled open.
    await expect(page.getByLabel('Expand the page header')).toBeFocused();
    await page.keyboard.press('Enter');
    await page.waitForTimeout(300);
    await expect(pageTitle).toBeInViewport();
  });

  // PageHeader buttons move into MenuButton on small screens
  test.skip('@avt-header-buttons-move-to-menubutton-on-small-screens', async ({
    page,
  }) => {
    await visitStory(page, {
      component: 'PageHeader',
      id: 'components-pageheader--fully-loaded-and-some',
      globals: {
        carbonTheme: 'white',
      },
    });
    // Race conditions
    // Wait for the "+13" tag element to appear and be visible
    await page.waitForSelector(
      `span.${carbon.prefix}--tag__label[title="+13"]`,
      {
        visible: true,
      }
    );

    // renders all buttons on large screens by default
    await pressTabKey(page, 15);
    await expect(
      page.getByRole('button', { name: 'danger Danger button' })
    ).toBeFocused();
    await page.keyboard.press('Tab');
    await expect(
      page.getByRole('button', { name: 'Secondary button' })
    ).toBeFocused();
    await page.keyboard.press('Tab');
    await expect(
      page.getByRole('button', { name: 'Primary button' })
    ).toBeFocused();
    // collapses into menu button on small screens
    await page.setViewportSize({ width: 1024, height: 768 });
    // reset focus to first focusable element
    await page
      .getByLabel('Breadcrumb', { exact: true })
      .getByRole('button')
      .focus();
    await pressTabKey(page, 6);

    await expect(
      page.getByRole('button', { name: 'Page actions' })
    ).toBeFocused();
    await page.keyboard.press('Enter');
    (await page.locator('*:focus').textContent()) === 'Primary button';
    await page.keyboard.press('ArrowDown');
    (await page.locator('*:focus').textContent()) === 'Secondary button';
    await page.keyboard.press('ArrowDown');
    (await page.locator('*:focus').textContent()) === 'Danger button';
    await page.keyboard.press('Escape');
    await expect(
      page.getByRole('button', { name: 'Page actions' })
    ).toBeFocused();
  });

  // PageHeader buttons change position when header collapsed
  test('@avt-buttons-change-position-when-header-collapsed', async ({
    page,
  }) => {
    await visitStory(page, {
      component: 'PageHeader',
      id: 'components-pageheader--fully-loaded-and-some',
      globals: {
        carbonTheme: 'white',
      },
    });

    // Race conditions
    // Wait for the "+13" tag element to appear and be visible
    await page.waitForSelector(
      `span.${carbon.prefix}--tag__label[title="+13"]`,
      {
        visible: true,
      }
    );

    // renders all buttons on large screens by default
    await pressTabKey(page, 15);
    await expect(
      page.getByRole('button', { name: 'danger Danger button' })
    ).toBeFocused();
    await page.keyboard.press('Tab');
    await expect(
      page.getByRole('button', { name: 'Secondary button' })
    ).toBeFocused();
    await page.keyboard.press('Tab');
    await expect(
      page.getByRole('button', { name: 'Primary button' })
    ).toBeFocused();

    // collapse the header
    await pressTabKey(page, 3);
    await page.keyboard.press('Enter');
    await page.waitForSelector(
      `.${pkg.prefix}--page-header__collapse-expand-toggle--collapsed`,
      { visible: true }
    );

    // reset focus to first focusable element
    await page.getByRole('link', { name: 'Home page' }).focus();
    await pressTabKey(page, 4);
    await expect(
      page.getByRole('button', { name: 'Page actions...' })
    ).toBeFocused();
    await page.keyboard.press('Enter');
    (await page.locator('*:focus').textContent()) === 'Primary button';
    await page.keyboard.press('ArrowDown');
    (await page.locator('*:focus').textContent()) === 'Secondary button';
    await page.keyboard.press('ArrowDown');
    (await page.locator('*:focus').textContent()) === 'Danger button';
    await page.keyboard.press('Escape');
    await expect(
      page.getByRole('button', { name: 'Page actions' })
    ).toBeFocused();
  });

  // action bar buttons move into MenuButton on small screens
  test('@avt-action-buttons-move-to-menubutton-on-small-screens', async ({
    page,
  }) => {
    await visitStory(page, {
      component: 'PageHeader',
      id: 'components-pageheader--fully-loaded-and-some',
      globals: {
        carbonTheme: 'white',
      },
    });

    // Race conditions
    // Wait for the "+13" tag element to appear and be visible
    await page.waitForSelector(
      `span.${carbon.prefix}--tag__label[title="+13"]`,
      {
        visible: true,
      }
    );

    // renders all buttons on large screens by default
    await pressTabKey(page, 4);
    await expect(page.getByRole('tooltip').getByText('Action 1')).toBeVisible();
    await page.keyboard.press('Tab');
    await expect(page.getByRole('tooltip').getByText('Action 2')).toBeVisible();
    await page.keyboard.press('Tab');
    await expect(page.getByRole('tooltip').getByText('Action 3')).toBeVisible();
    await pressTabKey(page, 5);
    await expect(page.getByRole('tooltip').getByText('Action 8')).toBeVisible();
    await page.keyboard.press('Tab');
    await expect(page.getByRole('tooltip').getByText('Action 9')).toBeVisible();

    // collapses into menu button on small screens
    await page.setViewportSize({ width: 1024, height: 768 });
    // reset focus to first focusable element
    await page
      .getByLabel('Breadcrumb', { exact: true })
      .getByRole('button')
      .focus();
    await pressTabKey(page, 1);
    await expect(page.getByRole('tooltip').getByText('Action 1')).toBeVisible();
    await pressTabKey(page, 2);
    await expect(page.getByRole('tooltip').getByText('Action 3')).toBeVisible();
    await pressTabKey(page, 1);
    await expect(
      page.getByRole('button', { name: 'Show further action bar items' })
    ).toBeFocused();
    await page.keyboard.press('Enter');
    (await page.locator('*:focus').textContent()) === 'Action 4';
    await page.keyboard.press('ArrowDown');
    (await page.locator('*:focus').textContent()) === 'Action 5';
    await page.keyboard.press('ArrowDown');
    (await page.locator('*:focus').textContent()) === 'Action 6';
    await page.keyboard.press('ArrowDown');
    await page.keyboard.press('ArrowDown');
    await page.keyboard.press('ArrowDown');
    await page.keyboard.press('ArrowDown');
    (await page.locator('*:focus').textContent()) === 'Action 10';
    await page.keyboard.press('Escape');
    await expect(
      page.getByRole('button', { name: 'Show further action bar items' })
    ).toBeFocused();
  });
});

async function pressTabKey(page, number) {
  for (let i = 0; i < number; i++) {
    await page.keyboard.press('Tab');
    await page.waitForTimeout(40);
  }
}

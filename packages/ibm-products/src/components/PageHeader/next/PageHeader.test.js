/**
 * Copyright IBM Corp. 2025, 2025
 *
 * This source code is licensed under the Apache-2.0 license found in the
 * LICENSE file in the root directory of this source tree.
 */

import { render, screen, act, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import React from 'react';
import { preview__PageHeader as PageHeader } from '../../..';
import {
  PageHeader as PageHeaderDirect,
  PageHeaderBreadcrumbBar as PageHeaderBreadcrumbBarDirect,
  PageHeaderContent as PageHeaderContentDirect,
  PageHeaderTabBar as PageHeaderTabBarDirect,
} from './PageHeader';
import { breakpoints } from '@carbon/layout';
import {
  Breadcrumb,
  BreadcrumbItem,
  TabList,
  Tabs,
  Tab,
  TabPanels,
  TabPanel,
} from '@carbon/react';
import { Bee } from '@carbon/icons-react';

import { useOverflowItems } from '../../../global/js/hooks/useOverflowItems';
jest.mock('../../../global/js/hooks/useOverflowItems');

let mockOverflowOnChange = jest.fn();

jest.mock('../../../global/js/hooks/useOverflowItems');

jest.mock('@carbon/utilities', () => ({
  createOverflowHandler: jest.fn(({ onChange }) => {
    mockOverflowOnChange = onChange;
  }),
}));

const prefix = 'c4p';
const carbonPrefix = 'cds';

describe('PageHeader', () => {
  describe('export configuration', () => {
    it('supports dot notation component namespacing from the main entrypoint', () => {
      const { container } = render(
        <PageHeader.Root>
          <PageHeader.BreadcrumbBar />
          <PageHeader.Content title="title" />
          <PageHeader.TabBar />
        </PageHeader.Root>
      );
      expect(container.firstChild).toBeInTheDocument();
    });

    it('supports direct component imports from the PageHeader path', () => {
      const { container } = render(
        <PageHeaderDirect>
          <PageHeaderBreadcrumbBarDirect />
          <PageHeaderContentDirect title="title" />
          <PageHeaderTabBarDirect />
        </PageHeaderDirect>
      );
      expect(container.firstChild).toBeInTheDocument();
    });
  });

  describe('PageHeader.Root component api', () => {
    it('should render', () => {
      const { container } = render(<PageHeader.Root />);
      expect(container.firstChild).toBeInTheDocument();
    });

    it('should place className on the outermost element', () => {
      const { container } = render(
        <PageHeader.Root className="custom-class" />
      );
      expect(container.firstChild).toHaveClass('custom-class');
    });
  });

  describe('PageHeader.BreadcrumbBar component api', () => {
    it('should render', () => {
      const { container } = render(
        <PageHeader.Root>
          <PageHeader.BreadcrumbBar />
        </PageHeader.Root>
      );
      expect(container.firstChild).toBeInTheDocument();
    });

    it('should place className on the outermost element', () => {
      const { container } = render(
        <PageHeader.Root>
          <PageHeader.BreadcrumbBar className="custom-class" />
        </PageHeader.Root>
      );
      expect(container.firstChild.firstChild).toHaveClass('custom-class');
    });

    it('should render an icon', () => {
      const { container } = render(
        <PageHeader.Root>
          <PageHeader.BreadcrumbBar
            renderIcon={() => {
              return <Bee size={16} />;
            }}
          />
        </PageHeader.Root>
      );

      const icon = container.querySelector(
        `.${prefix}--page-header__breadcrumb__icon`
      );
      expect(icon).toBeInTheDocument();
    });

    it('should render breadcrumb items', () => {
      const { container } = render(
        <PageHeader.Root>
          <PageHeader.BreadcrumbBar>
            <Breadcrumb>
              <BreadcrumbItem href="/#">Breadcrumb 1</BreadcrumbItem>
              <BreadcrumbItem href="#">Breadcrumb 2</BreadcrumbItem>
            </Breadcrumb>
          </PageHeader.BreadcrumbBar>
        </PageHeader.Root>
      );

      const breadcrumbs = container.getElementsByClassName(
        `${carbonPrefix}--breadcrumb-item`
      );

      expect(breadcrumbs.length).toBe(2);
    });

    it('should render content actions', () => {
      const { container } = render(
        <PageHeader.Root>
          <PageHeader.BreadcrumbBar
            contentActions={
              <button className="content-action-item">Button</button>
            }
          >
            <Breadcrumb>
              <BreadcrumbItem href="/#">Breadcrumb 1</BreadcrumbItem>
              <BreadcrumbItem href="#">Breadcrumb 2</BreadcrumbItem>
            </Breadcrumb>
          </PageHeader.BreadcrumbBar>
        </PageHeader.Root>
      );

      const elem = container.querySelector(`.content-action-item`);
      expect(elem).toBeInTheDocument();
    });

    it('should render page actions', () => {
      const { container } = render(
        <PageHeader.Root>
          <PageHeader.BreadcrumbBar
            pageActions={<button className="page-action-item">Button</button>}
          >
            <Breadcrumb>
              <BreadcrumbItem href="/#">Breadcrumb 1</BreadcrumbItem>
              <BreadcrumbItem href="#">Breadcrumb 2</BreadcrumbItem>
            </Breadcrumb>
          </PageHeader.BreadcrumbBar>
        </PageHeader.Root>
      );

      const elem = container.querySelector(`.page-action-item`);
      expect(elem).toBeInTheDocument();
    });

    it('should render the page header title breadcrumb', () => {
      const { container } = render(
        <PageHeader.Root>
          <PageHeader.BreadcrumbBar
            pageActions={<button className="page-action-item">Button</button>}
          >
            <Breadcrumb>
              <BreadcrumbItem href="/#">Breadcrumb 1</BreadcrumbItem>
              <BreadcrumbItem href="#">Breadcrumb 2</BreadcrumbItem>
              <PageHeader.TitleBreadcrumb className="title-breadcrumb-item">
                Title
              </PageHeader.TitleBreadcrumb>
            </Breadcrumb>
          </PageHeader.BreadcrumbBar>
          <PageHeader.Content title="title" />
        </PageHeader.Root>
      );
      const titleBreadcrumbElement = container.querySelector(
        '.title-breadcrumb-item'
      );
      expect(titleBreadcrumbElement).toBeInTheDocument();
    });
  });

  describe('PageHeader.Content component api', () => {
    it('should render', () => {
      const { container } = render(
        <PageHeader.Root>
          <PageHeader.Content title="title" />
        </PageHeader.Root>
      );
      expect(container.firstChild).toBeInTheDocument();
    });

    it('should place className on the outermost element', () => {
      const { container } = render(
        <PageHeader.Root>
          <PageHeader.Content className="custom-class" title="title" />
        </PageHeader.Root>
      );
      expect(container.firstChild.firstChild).toHaveClass('custom-class');
    });

    it('should render a title', () => {
      render(
        <PageHeader.Root>
          <PageHeader.Content title="Page header content title" />
        </PageHeader.Root>
      );

      expect(screen.getByText('Page header content title')).toBeInTheDocument();
    });

    it('should render an icon', () => {
      const { container } = render(
        <PageHeader.Root>
          <PageHeader.Content
            title="title"
            renderIcon={() => {
              return <Bee size={32} />;
            }}
          ></PageHeader.Content>
        </PageHeader.Root>
      );

      const icon = container.querySelector(
        `.${prefix}--page-header__content__icon`
      );
      expect(icon).toBeInTheDocument();
    });

    it('should render children', () => {
      render(
        <PageHeader.Root>
          <PageHeader.Content title="title">
            Children content
          </PageHeader.Content>
        </PageHeader.Root>
      );

      expect(screen.getByText('Children content')).toBeInTheDocument();
    });

    it('should render contextual actions', () => {
      const { container } = render(
        <PageHeader.Root>
          <PageHeader.Content
            title="title"
            contextualActions={
              <>
                <div>action 1</div>
                <div>action 2</div>
                <div>action 3</div>
              </>
            }
          ></PageHeader.Content>
        </PageHeader.Root>
      );

      const pageActions = container.querySelector(
        `.${prefix}--page-header__content__contextual-actions`
      );
      expect(pageActions).toBeInTheDocument();
    });

    it('should render page actions', () => {
      const { container } = render(
        <PageHeader.Root>
          <PageHeader.Content
            title="title"
            pageActions={<button>page actions</button>}
          ></PageHeader.Content>
        </PageHeader.Root>
      );

      const buttonElement = screen.getByText(/page actions/i);
      expect(buttonElement).toBeInTheDocument();
    });
  });

  describe('PageHeader.ContentPageActions component api', () => {
    const onClickMock = jest.fn();
    const mockPageActions = [
      {
        id: 'action1',
        onClick: jest.fn(),
        body: <button>Visible Action</button>,
        menuItem: {
          label: 'Action 1',
        },
      },
      {
        id: 'action2',
        onClick: onClickMock,
        body: <button>Hidden Action</button>,
        menuItem: {
          label: 'Action 2',
        },
      },
    ];

    it('should not show MenuButton when there are no hidden elements', async () => {
      // Render the component with the mock page actions
      const { container } = render(
        <PageHeader.Root>
          <PageHeader.ContentPageActions actions={mockPageActions} />
        </PageHeader.Root>
      );

      act(() => {
        mockOverflowOnChange(
          [mockPageActions[0]], // visible
          [] // no hidden elements
        );
      });

      // Check that the visible action is in the document
      expect(screen.getByText('Visible Action')).toBeInTheDocument();

      // check that the parent div of menu button is hidden
      const menuButton = container.querySelector(
        `.${carbonPrefix}--menu-button__container`
      );
      const parent = menuButton?.parentElement;
      expect(parent).toHaveAttribute('data-hidden');
    });

    it('should render MenuButton with hidden actions when overflow occurs', async () => {
      render(
        <PageHeader.Root>
          <PageHeader.ContentPageActions actions={mockPageActions} />
        </PageHeader.Root>
      );

      act(() => {
        mockOverflowOnChange(
          [mockPageActions[0]], // visible
          [mockPageActions[1]] // hidden
        );
      });

      // Find the menu button
      const menuButton = await screen.findByRole('button', {
        name: /Actions/i,
      });
      expect(menuButton).toBeInTheDocument();

      await act(() => {
        userEvent.click(menuButton);
      });

      const menu = await screen.findByRole('menu');
      expect(menu).toBeInTheDocument();

      // Check if the hidden action appears in the menu
      const menuItems = screen.getAllByRole('menuitem');
      expect(menuItems).toHaveLength(1); // Expecting just 1 item (the hidden action)
      expect(menuItems[0]).toHaveTextContent('Action 2');
    });

    it('should apply a custom className', () => {
      const { container } = render(
        <PageHeader.Root>
          <PageHeader.ContentPageActions
            className="custom-class"
            actions={mockPageActions}
          />
        </PageHeader.Root>
      );
      expect(container.firstChild.firstChild).toHaveClass('custom-class');
    });

    it('should use a custom menuButtonLabel if provided', () => {
      render(
        <PageHeader.Root>
          <PageHeader.ContentPageActions
            actions={mockPageActions}
            menuButtonLabel="Options"
          />
        </PageHeader.Root>
      );
      expect(screen.getByText('Options')).toBeInTheDocument();
    });

    it('should call onClick of hidden action when MenuItem is clicked', async () => {
      render(
        <PageHeader.Root>
          <PageHeader.ContentPageActions actions={mockPageActions} />
        </PageHeader.Root>
      );

      await act(() =>
        mockOverflowOnChange(
          [mockPageActions[0]], // visible
          [mockPageActions[1]] // hidden
        )
      );

      // Find the menu button
      const menuButton = await screen.findByRole('button', {
        name: /Actions/i,
      });
      expect(menuButton).toBeInTheDocument();

      await act(() => userEvent.click(menuButton));

      const menuItem = await screen.findByRole('menuitem', {
        name: /Action 2/i,
      });

      expect(menuItem).toBeInTheDocument();

      await act(() => userEvent.click(menuItem));

      expect(onClickMock).toHaveBeenCalledTimes(1);
    });
  });

  describe('PageHeader.ContentText component api', () => {
    it('should render the child text', () => {
      const { container, getByText } = render(
        <PageHeader.Root>
          <PageHeader.ContentText>
            PageHeader content title
          </PageHeader.ContentText>
        </PageHeader.Root>
      );
      expect(container.firstChild).toBeInTheDocument();
      expect(getByText('PageHeader content title')).toBeInTheDocument();
    });

    it('should place className on the outermost element', () => {
      const { container } = render(
        <PageHeader.Root>
          <PageHeader.ContentText className="custom-class" />
        </PageHeader.Root>
      );
      expect(container.firstChild.firstChild).toHaveClass('custom-class');
    });

    it('should render a subtitle', () => {
      render(
        <PageHeader.Root>
          <PageHeader.ContentText subtitle="subtitle" />
        </PageHeader.Root>
      );

      expect(screen.getByText('subtitle')).toBeInTheDocument();
    });
  });

  describe('PageHeader.HeroImage component api', () => {
    beforeEach(() => {
      Object.defineProperty(window, 'matchMedia', {
        writable: true,
        value: jest.fn().mockImplementation((query) => ({
          matches: false,
          media: query,
          onchange: null,
          addEventListener: jest.fn(),
          removeEventListener: jest.fn(),
          dispatchEvent: jest.fn(),
        })),
      });
    });

    it('should place className on the outermost element', () => {
      const { container } = render(
        <PageHeader.Root>
          <PageHeader.HeroImage className="custom-class" />
        </PageHeader.Root>
      );
      expect(container.firstChild.firstChild).toHaveClass('custom-class');
    });

    it('should use a 2x1 ratio on large screens', () => {
      Object.defineProperty(window, 'matchMedia', {
        writable: true,
        value: jest.fn().mockImplementation((query) => ({
          matches: true,
          media: query,
          onchange: null,
          addEventListener: jest.fn(),
          removeEventListener: jest.fn(),
          dispatchEvent: jest.fn(),
        })),
      });

      const { container } = render(
        <PageHeader.Root>
          <PageHeader.HeroImage>
            <picture>
              <source
                srcSet="https://picsum.photos/200/100"
                media={`(min-width: ${breakpoints.lg.width}`}
              />
              <source
                srcSet="https://picsum.photos/300/200"
                media={`(max-width: ${breakpoints.lg.width}`}
              />
              <img
                src="https://picsum.photos/200/100"
                alt="a default image"
                style={{ maxWidth: '100%', height: 'auto' }}
              />
            </picture>
          </PageHeader.HeroImage>
        </PageHeader.Root>
      );

      expect(container.firstChild.firstChild).toHaveClass(
        `${carbonPrefix}--aspect-ratio--2x1`
      );
    });

    it('should use a 3x2 ratio on small screens', () => {
      const { container } = render(
        <PageHeader.Root>
          <PageHeader.HeroImage>
            <picture>
              <source
                srcSet="https://picsum.photos/200/100"
                media={`(min-width: ${breakpoints.lg.width}`}
              />
              <source
                srcSet="https://picsum.photos/300/200"
                media={`(max-width: ${breakpoints.lg.width}`}
              />
              <img
                src="https://picsum.photos/200/100"
                alt="a default image"
                style={{ maxWidth: '100%', height: 'auto' }}
              />
            </picture>
          </PageHeader.HeroImage>
        </PageHeader.Root>
      );

      expect(container.firstChild.firstChild).toHaveClass(
        `${carbonPrefix}--aspect-ratio--3x2`
      );
    });
  });

  describe('PageHeader.TabBar component api', () => {
    it('should render', () => {
      const { container } = render(
        <PageHeader.Root>
          <PageHeader.TabBar />
        </PageHeader.Root>
      );
      expect(container.firstChild).toBeInTheDocument();
    });

    it('should place className on the outermost element', () => {
      const { container } = render(
        <PageHeader.Root>
          <PageHeader.TabBar className="custom-class" />
        </PageHeader.Root>
      );
      expect(container.firstChild.firstChild).toHaveClass('custom-class');
    });
  });

  describe('PageHeader.TabBar component with tags', () => {
    const mockTags = [
      { id: '1', type: 'blue', text: 'Tag 1', size: 'md' },
      { id: '2', type: 'green', text: 'Tag 2', size: 'md' },
      { id: '3', type: 'purple', text: 'Tag 3', size: 'md' },
    ];

    it('should render tags when provided', () => {
      useOverflowItems.mockReturnValue({
        visibleItems: mockTags,
        hiddenItems: [],
        itemRefHandler: jest.fn(),
      });

      render(
        <PageHeader.Root>
          <PageHeader.TabBar tags={mockTags} />
        </PageHeader.Root>
      );

      expect(screen.getByText('Tag 1')).toBeInTheDocument();
      expect(screen.getByText('Tag 2')).toBeInTheDocument();
      expect(screen.getByText('Tag 3')).toBeInTheDocument();
    });

    it('should not render tags when not provided', () => {
      render(
        <PageHeader.Root>
          <PageHeader.TabBar />
        </PageHeader.Root>
      );

      expect(screen.queryByText('Tag 1')).not.toBeInTheDocument();
      expect(screen.queryByText('Tag 2')).not.toBeInTheDocument();
      expect(screen.queryByText('Tag 3')).not.toBeInTheDocument();
    });

    it('should render tags alongside tabs', () => {
      useOverflowItems.mockReturnValue({
        visibleItems: mockTags,
        hiddenItems: [],
        itemRefHandler: jest.fn(),
      });

      render(
        <PageHeader.Root>
          <PageHeader.TabBar tags={mockTags}>
            <TabList aria-label="List of tabs">
              <Tab>Tab 1</Tab>
              <Tab>Tab 2</Tab>
            </TabList>
          </PageHeader.TabBar>
        </PageHeader.Root>
      );

      expect(screen.getByText('Tab 1')).toBeInTheDocument();
      expect(screen.getByText('Tab 2')).toBeInTheDocument();
      expect(screen.getByText('Tag 1')).toBeInTheDocument();
      expect(screen.getByText('Tag 2')).toBeInTheDocument();
      expect(screen.getByText('Tag 3')).toBeInTheDocument();
    });

    it('should apply correct classes to tags container', () => {
      useOverflowItems.mockReturnValue({
        visibleItems: mockTags,
        hiddenItems: [],
        itemRefHandler: jest.fn(),
      });

      const { container } = render(
        <PageHeader.Root>
          <PageHeader.TabBar tags={mockTags} />
        </PageHeader.Root>
      );

      const tagsContainer = container.querySelector(
        `.${prefix}--page-header__tags`
      );
      expect(tagsContainer).toBeInTheDocument();
    });

    it('should maintain tab focus management with tags present', async () => {
      useOverflowItems.mockReturnValue({
        visibleItems: mockTags,
        hiddenItems: [],
        itemRefHandler: jest.fn(),
      });

      render(
        <Tabs>
          <PageHeader.Root>
            <PageHeader.TabBar tags={mockTags}>
              <TabList aria-label="List of tabs">
                <Tab>Tab 1</Tab>
                <Tab>Tab 2</Tab>
                <Tab>Tab 3</Tab>
              </TabList>
            </PageHeader.TabBar>
          </PageHeader.Root>
          <TabPanels>
            <TabPanel>Tab Panel 1</TabPanel>
            <TabPanel>Tab Panel 2</TabPanel>
            <TabPanel>Tab Panel 3</TabPanel>
          </TabPanels>
        </Tabs>
      );

      const tab1Button = screen.getByRole('tab', { name: 'Tab 1' });
      const tab2Button = screen.getByRole('tab', { name: 'Tab 2' });
      const tab3Button = screen.getByRole('tab', { name: 'Tab 3' });

      // Verify tabs can be focused and clicked
      await act(() => userEvent.click(tab2Button));
      await waitFor(() => {
        expect(screen.getByText('Tab Panel 2')).toBeInTheDocument();
      });

      await act(() => userEvent.click(tab3Button));
      await waitFor(() => {
        expect(screen.getByText('Tab Panel 3')).toBeInTheDocument();
      });

      // Verify tags are still present and functional
      expect(screen.getByText('Tag 1')).toBeInTheDocument();
      expect(screen.getByText('Tag 2')).toBeInTheDocument();
      expect(screen.getByText('Tag 3')).toBeInTheDocument();
    });

    describe('Overflow functionality', () => {
      it('should handle overflow items correctly', () => {
        useOverflowItems.mockReturnValue({
          visibleItems: mockTags.slice(0, 2), // Only Tag 1 and Tag 2
          hiddenItems: mockTags.slice(2), // Only Tag 3
          itemRefHandler: jest.fn(),
        });

        render(
          <PageHeader.Root>
            <PageHeader.TabBar tags={mockTags}>
              <TabList aria-label="List of tabs">
                <Tab>Tab 1</Tab>
              </TabList>
              <TabPanels>
                <TabPanel>Tab Panel 1</TabPanel>
              </TabPanels>
            </PageHeader.TabBar>
          </PageHeader.Root>
        );

        // Check that only visible tags are rendered
        expect(screen.getByText('Tag 1')).toBeInTheDocument();
        expect(screen.getByText('Tag 2')).toBeInTheDocument();

        // Check that overflow indicator is present
        expect(screen.getByText('+1')).toBeInTheDocument();

        // Check that the overflow button is not expanded (popover closed)
        const overflowButton = screen.getByRole('button', { name: '+1' });
        expect(overflowButton).toHaveAttribute('aria-expanded', 'false');
      });

      it('should not show overflow tag when all items are visible', () => {
        useOverflowItems.mockReturnValue({
          visibleItems: mockTags,
          hiddenItems: [],
          itemRefHandler: jest.fn(),
        });

        render(
          <PageHeader.Root>
            <PageHeader.TabBar tags={mockTags} />
          </PageHeader.Root>
        );

        // All tags should be visible
        mockTags.forEach((tag) => {
          expect(screen.getByText(tag.text)).toBeInTheDocument();
        });

        // No overflow indicator should be present
        expect(screen.queryByText(/^\+\d+$/)).not.toBeInTheDocument();
      });

      it('should show hidden tags in popover when overflow tag is clicked', async () => {
        useOverflowItems.mockReturnValue({
          visibleItems: mockTags.slice(0, 2),
          hiddenItems: mockTags.slice(2),
          itemRefHandler: jest.fn(),
        });

        render(
          <PageHeader.Root>
            <PageHeader.TabBar tags={mockTags} />
          </PageHeader.Root>
        );

        const overflowButton = screen.getByRole('button', { name: '+1' });

        // Initially popover should be closed
        expect(overflowButton).toHaveAttribute('aria-expanded', 'false');

        // Click to open popover
        await await act(() => userEvent.click(overflowButton));

        // Check that popover is now open
        await waitFor(() => {
          expect(overflowButton).toHaveAttribute('aria-expanded', 'true');
        });
      });

      it('should close popover when clicked outside', async () => {
        useOverflowItems.mockReturnValue({
          visibleItems: mockTags.slice(0, 2),
          hiddenItems: mockTags.slice(2),
          itemRefHandler: jest.fn(),
        });

        render(
          <PageHeader.Root>
            <PageHeader.TabBar tags={mockTags} />
          </PageHeader.Root>
        );

        const overflowButton = screen.getByRole('button', { name: '+1' });

        // Click to open popover
        await await act(() => userEvent.click(overflowButton));

        // Verify popover is open
        await waitFor(() => {
          expect(overflowButton).toHaveAttribute('aria-expanded', 'true');
        });

        // Click outside popover
        await await act(() => userEvent.click(document.body));

        // Verify popover is closed
        await waitFor(() => {
          expect(overflowButton).toHaveAttribute('aria-expanded', 'false');
        });
      });

      it('should handle window resize by closing popover', async () => {
        useOverflowItems.mockReturnValue({
          visibleItems: mockTags.slice(0, 2),
          hiddenItems: mockTags.slice(2),
          itemRefHandler: jest.fn(),
        });

        render(
          <PageHeader.Root>
            <PageHeader.TabBar tags={mockTags} />
          </PageHeader.Root>
        );

        const overflowButton = screen.getByRole('button', { name: '+1' });

        // Click to open popover
        await act(() => userEvent.click(overflowButton));

        // Verify popover is open
        await waitFor(() => {
          expect(overflowButton).toHaveAttribute('aria-expanded', 'true');
        });

        // Simulate window resize
        act(() => {
          window.dispatchEvent(new Event('resize'));
        });

        // Verify popover is closed after resize
        await waitFor(() => {
          expect(overflowButton).toHaveAttribute('aria-expanded', 'false');
        });
      });

      it('should handle useOverflowItems returning null/undefined', () => {
        // Mock the hook to return undefined/null
        useOverflowItems.mockReturnValue(null);

        render(
          <PageHeader.Root>
            <PageHeader.TabBar tags={mockTags} />
          </PageHeader.Root>
        );

        // Should use fallback values
        const tagsContainer = document.querySelector(
          `.${prefix}--page-header__tags`
        );
        expect(tagsContainer).toBeInTheDocument();

        // Should not render any tags (fallback to empty arrays)
        expect(screen.queryByText('Tag 1')).not.toBeInTheDocument();
      });

      it('should handle useOverflowItems returning undefined properties', () => {
        // Mock with missing properties
        useOverflowItems.mockReturnValue({
          visibleItems: undefined,
          hiddenItems: undefined,
          itemRefHandler: undefined,
        });

        render(
          <PageHeader.Root>
            <PageHeader.TabBar tags={mockTags} />
          </PageHeader.Root>
        );

        // Should use fallback values from the || operator
        const tagsContainer = document.querySelector(
          `.${prefix}--page-header__tags`
        );
        expect(tagsContainer).toBeInTheDocument();
      });

      it('should handle useOverflowItems with partial data', () => {
        // Mock with only some properties
        useOverflowItems.mockReturnValue({
          visibleItems: mockTags.slice(0, 1),
          // hiddenItems and itemRefHandler missing
        });

        render(
          <PageHeader.Root>
            <PageHeader.TabBar tags={mockTags} />
          </PageHeader.Root>
        );

        expect(screen.getByText('Tag 1')).toBeInTheDocument();
      });
    });
  });
  describe('PageHeader.TabBar with scroller button', () => {
    const mockTags = [
      { id: '1', type: 'blue', text: 'Tag 1', size: 'md' },
      { id: '2', type: 'green', text: 'Tag 2', size: 'md' },
      { id: '3', type: 'purple', text: 'Tag 3', size: 'md' },
    ];
    beforeEach(() => {
      window.IntersectionObserver = jest.fn().mockImplementation(() => ({
        observe: () => null,
        unobserve: () => null,
      }));
    });
    it('should render a tab bar with scroller button and tags', () => {
      render(
        <PageHeader.Root>
          <PageHeader.Content>Hello</PageHeader.Content>
          <PageHeaderTabBarDirect
            tags={mockTags}
            scroller={<PageHeader.ScrollButton />}
          />
        </PageHeader.Root>
      );
      expect(screen.getByLabelText('Collapse')).toBeInTheDocument();
    });
    it('should render a tab bar with scroller button and without passing tags', () => {
      render(
        <PageHeader.Root>
          <PageHeader.Content>Hello</PageHeader.Content>
          <PageHeaderTabBarDirect scroller={<PageHeader.ScrollButton />} />
        </PageHeader.Root>
      );
      expect(screen.getByLabelText('Collapse')).toBeInTheDocument();
    });
    it('should call onClick function passed to scroller', async () => {
      const scrollerOnClick = jest.fn();
      render(
        <PageHeader.Root>
          <PageHeader.Content>Hello</PageHeader.Content>
          <PageHeaderTabBarDirect
            scroller={<PageHeader.ScrollButton onClick={scrollerOnClick} />}
          />
        </PageHeader.Root>
      );
      const scrollerButton = screen.getByLabelText('Collapse');
      expect(scrollerButton).toBeInTheDocument();

      await act(() => {
        userEvent.click(scrollerButton);
      });
      expect(scrollerOnClick).toHaveBeenCalledTimes(1);
    });
  });
});

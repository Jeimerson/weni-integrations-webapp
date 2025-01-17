import { unnnicCallAlert as mockUnnnicCallAlert } from '@weni/unnnic-system';

jest.mock('@weni/unnnic-system', () => ({
  ...jest.requireActual('@weni/unnnic-system'),
  unnnicCallAlert: jest.fn(),
}));

import Vuex from 'vuex';
import { shallowMount, createLocalVue } from '@vue/test-utils';
import MyApps from '@/views/MyApps.vue';
import AppGrid from '@/components/AppGrid.vue';
import { singleApp } from '../../../__mocks__/appMock';

const genericApp = {
  ...singleApp,
  name: 'generic',
  code: 'generic',
  generic: true,
  config: { channel_name: 'A random generic' },
};

const localVue = createLocalVue();
localVue.use(Vuex);

describe('MyApps.vue', () => {
  let wrapper;
  let actions;
  let state;
  let store;

  beforeEach(() => {
    actions = {
      getConfiguredApps: jest.fn(() => {
        return {
          data: [singleApp, genericApp],
        };
      }),
      getInstalledApps: jest.fn(() => {
        return { data: [singleApp, genericApp] };
      }),
      deleteApp: jest.fn(),
    };

    state = {
      appType: {
        loadingDeleteApp: false,
        errorDeleteApp: false,
      },
      myApps: {
        configuredApps: [singleApp, genericApp],
        loadingConfiguredApps: false,
        errorConfiguredApps: null,
        installedApps: [singleApp, genericApp],
        loadingInstalledApps: false,
        errorInstalledApps: null,
      },
      auth: {
        project: '123',
      },
    };

    store = new Vuex.Store({
      actions,
      state,
    });

    wrapper = shallowMount(MyApps, {
      localVue,
      store,
      mocks: {
        $t: () => 'some specific text',
        $router: {
          replace: jest.fn(),
        },
        $route: {
          path: '/apps/1/details',
        },
      },
      stubs: {
        AppGrid,
      },
    });
  });

  it('should be rendered properly', () => {
    expect(wrapper).toMatchSnapshot();
  });

  describe('hasApps', () => {
    it('should return true if loadings are still ocurring', () => {
      store.state.myApps.loadingConfiguredApps = false;
      store.state.myApps.loadingInstalledApps = true;
      expect(wrapper.vm.hasApps).toBeTruthy();
    });

    it('should return true if not loading and have data', async () => {
      store.state.myApps.loadingConfiguredApps = false;
      store.state.myApps.loadingInstalledApps = false;
      store.state.myApps.configuredApps = [singleApp];
      store.state.myApps.installedApps = [];

      expect(wrapper.vm.hasApps).toBeTruthy();
    });

    it('should return false if not loading and dont have data', async () => {
      store.state.myApps.loadingConfiguredApps = false;
      store.state.myApps.loadingInstalledApps = false;
      store.state.myApps.configuredApps = [];
      store.state.myApps.installedApps = [];

      expect(wrapper.vm.hasApps).toBeFalsy();
    });
  });

  describe('navigateToDiscovery', () => {
    it('should change route to discovery', () => {
      const spy = spyOn(wrapper.vm.$router, 'replace');
      wrapper.vm.navigateToDiscovery();

      expect(spy).toBeCalledTimes(1);
      expect(spy).toHaveBeenCalledWith(`/apps/discovery`);
    });
  });

  describe('fetchCategories()', () => {
    it('should call fetchConfigured()', () => {
      const spy = spyOn(wrapper.vm, 'fetchConfigured');
      expect(spy).not.toHaveBeenCalled();
      wrapper.vm.fetchCategories();
      expect(spy).toHaveBeenCalledTimes(1);
    });

    it('should call fetchInstalled()', () => {
      const spy = spyOn(wrapper.vm, 'fetchInstalled');
      expect(spy).not.toHaveBeenCalled();
      wrapper.vm.fetchCategories();
      expect(spy).toHaveBeenCalledTimes(1);
    });
  });

  describe('fetchConfigured()', () => {
    beforeEach(() => {
      jest.clearAllMocks();
    });

    it('should call getConfiguredApps()', async () => {
      expect(actions.getConfiguredApps).not.toHaveBeenCalled();
      await wrapper.vm.fetchConfigured();
      expect(actions.getConfiguredApps).toHaveBeenCalledTimes(1);
    });

    it('should call callErrorModal on error', async () => {
      store.state.myApps.errorConfiguredApps = true;
      const spy = spyOn(wrapper.vm, 'callErrorModal');
      expect(spy).not.toHaveBeenCalled();
      await wrapper.vm.fetchConfigured();
      expect(spy).toHaveBeenCalledTimes(1);
    });
  });

  describe('fetchInstalled()', () => {
    beforeEach(() => {
      jest.clearAllMocks();
    });

    it('should call getInstalledApps()', async () => {
      expect(actions.getInstalledApps).not.toHaveBeenCalled();
      await wrapper.vm.fetchInstalled();
      expect(actions.getInstalledApps).toHaveBeenCalledTimes(1);
    });

    it('should call callErrorModal on error', async () => {
      store.state.myApps.errorInstalledApps = true;
      const spy = spyOn(wrapper.vm, 'callErrorModal');
      expect(spy).not.toHaveBeenCalled();
      await wrapper.vm.fetchInstalled();
      expect(spy).toHaveBeenCalledTimes(1);
    });
  });

  describe('callErrorModal', () => {
    it('should call unnnicCallAlert', () => {
      expect(mockUnnnicCallAlert).not.toHaveBeenCalled();
      wrapper.vm.callErrorModal({ text: 'error text' });
      expect(mockUnnnicCallAlert).toHaveBeenCalledTimes(1);
      expect(mockUnnnicCallAlert).toHaveBeenCalledWith(
        expect.objectContaining({
          props: {
            text: 'error text',
            title: expect.any(String),
            icon: expect.any(String),
            scheme: expect.any(String),
            position: expect.any(String),
            closeText: expect.any(String),
          },
          seconds: expect.any(Number),
        }),
      );
    });
  });

  describe('search', () => {
    it('should filter installed and configured apps by name', () => {
      expect(wrapper.vm.filteredConfiguredApps).toEqual([singleApp, genericApp]);
      expect(wrapper.vm.filteredInstalledApps).toEqual([singleApp, genericApp]);

      wrapper.vm.searchTerm = 'weni';
      expect(wrapper.vm.filteredConfiguredApps).toEqual([singleApp]);
      expect(wrapper.vm.filteredInstalledApps).toEqual([singleApp]);

      wrapper.vm.searchTerm = ' ';
      expect(wrapper.vm.filteredConfiguredApps).toEqual([singleApp, genericApp]);
      expect(wrapper.vm.filteredInstalledApps).toEqual([singleApp, genericApp]);
    });

    it('should return empty array if there were no apps from store', () => {
      store.state.myApps.installedApps = null;
      store.state.myApps.configuredApps = null;

      expect(wrapper.vm.filteredConfiguredApps).toEqual([]);
      expect(wrapper.vm.filteredInstalledApps).toEqual([]);
    });
  });
});

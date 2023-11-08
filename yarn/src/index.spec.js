import {test, expect} from 'vitest';
import {mount} from '@vue/test-utils';
import {h} from 'vue';
import foo from './foo.vue';

test('Can mount', () => {
  var wrapper = mount(foo, {
    slots: {
      body() { return h('div', {}, 'body') },
      header() { return h('div', {}, 'header') },
    }
  })

  expect(wrapper.element).toMatchSnapshot();
})
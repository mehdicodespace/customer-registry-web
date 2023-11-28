import { mount } from "@vue/test-utils";
import CustomerComponent from "@/components/CustomerComponent.vue";

describe("CustomerComponent.vue", () => {
  it("renders without crashing", () => {
    const wrapper = mount(CustomerComponent);
    expect(wrapper.exists()).toBe(true);
  });
});

import { mount } from "@vue/test-utils";
import CustomerList from "@/components/Customer/CustomerList.vue";

describe("CustomerList", () => {
  it("renders without crashing", () => {
    const wrapper = mount(CustomerList);
    expect(wrapper.exists()).toBe(true);
  });
});

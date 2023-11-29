import { mount } from "@vue/test-utils";
import CustomersList from "@/components/Customer/CustomersList.vue";
import { enableFetchMocks } from "jest-fetch-mock";
enableFetchMocks();

describe("CustomersList", () => {
  it("renders without crashing", () => {
    const wrapper = mount(CustomersList);
    expect(wrapper.exists()).toBe(true);
  });
});

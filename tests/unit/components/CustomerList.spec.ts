import { mount } from "@vue/test-utils";
import CustomerList from "@/components/Customer/CustomerList.vue";
import { enableFetchMocks } from "jest-fetch-mock";
enableFetchMocks();

describe("CustomerList", () => {
  it("renders without crashing", () => {
    const wrapper = mount(CustomerList);
    expect(wrapper.exists()).toBe(true);
  });
});

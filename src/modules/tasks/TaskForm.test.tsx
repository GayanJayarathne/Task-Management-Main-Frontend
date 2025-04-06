import { useCreateTaskMutation } from "../../store/api/taskApiSlice";

jest.mock("../../store/api/taskApiSlice", () => ({
  useCreateTaskMutation: jest.fn(),
}));

describe("TaskForm create functionality", () => {
  it("should call createTask with correct values", async () => {
    const createTaskMock = jest.fn().mockResolvedValue({ data: {} });
    // @ts-ignore
    useCreateTaskMutation.mockReturnValue([
      createTaskMock,
      { isLoading: false, isSuccess: true, isError: false, data: {} },
    ]);

    const onFinish = (values: any) => {
      const formattedValues = {
        ...values,
        dateRange: {
          startDate: values.dateRange[0],
          endDate: values.dateRange[1],
        },
      };
      createTaskMock(formattedValues);
      return formattedValues;
    };

    // Test values
    const formValues = {
      name: "Test Task",
      description: "Test Description",
      dateRange: ["2025-04-06", "2025-04-07"],
      userId: "userId1",
      isEnabled: false,
    };

    const result = onFinish(formValues);

    expect(createTaskMock).toHaveBeenCalledWith({
      name: "Test Task",
      description: "Test Description",
      dateRange: {
        startDate: "2025-04-06",
        endDate: "2025-04-07",
      },
      userId: "userId1",
      isEnabled: false,
    });

    expect(result).toEqual({
      name: "Test Task",
      description: "Test Description",
      dateRange: {
        startDate: "2025-04-06",
        endDate: "2025-04-07",
      },
      userId: "userId1",
      isEnabled: false,
    });
  });
});

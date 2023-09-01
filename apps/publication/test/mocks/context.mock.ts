export const contextMock: unknown = {
  getArgByIndex: jest.fn(),
  getChannelRef: jest.fn().mockReturnValue({ ack: jest.fn() }),
  getMessage: jest.fn(),
};

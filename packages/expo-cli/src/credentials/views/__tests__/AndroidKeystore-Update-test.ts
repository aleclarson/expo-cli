import { mockExpoXDL } from '../../../__tests__/mock-utils';
import prompts from '../../../prompts';
import { getCtxMock, testExperienceName } from '../../test-fixtures/mocks-android';
import { UpdateKeystore } from '../AndroidKeystore';

jest.mock('../../actions/list');
jest.mock('../../../prompts');
jest.mock('fs-extra');
mockExpoXDL({
  AndroidCredentials: {
    generateUploadKeystore: jest.fn(),
  },
});

const originalWarn = console.warn;
const originalLog = console.log;
beforeAll(() => {
  console.warn = jest.fn();
  console.log = jest.fn();
});
afterAll(() => {
  console.warn = originalWarn;
  console.log = originalLog;
});
beforeEach(() => {
  (prompts as any).mockReset();
  (prompts as any).mockImplementation(() => {
    throw new Error('Should not be called');
  });
});

describe('UpdateKeystore', () => {
  describe('existing credentials', () => {
    it('should check credentials and generate new', async () => {
      const ctx = getCtxMock();

      (prompts as any)
        .mockImplementationOnce(() => ({ answer: false })) // Let expo handle
        .mockImplementation(() => {
          throw new Error("shouldn't happen");
        });

      const view = new UpdateKeystore(testExperienceName);
      const lastView = await view.open(ctx);

      expect(lastView).toBe(null);
      expect((prompts as any).mock.calls.length).toBe(1);
      expect(ctx.android.fetchKeystore.mock.calls.length).toBe(1);
      expect(ctx.android.updateKeystore.mock.calls.length).toBe(1);
    });

    it('should check credentials and ask users for them', async () => {
      const ctx = getCtxMock();

      (prompts as any)
        .mockImplementationOnce(() => ({ answer: true })) // user specified
        .mockImplementation(() => ({ input: 'test' })); // keystore credentials

      const view = new UpdateKeystore(testExperienceName);
      const lastView = await view.open(ctx);

      expect(lastView).toBe(null);
      expect((prompts as any).mock.calls.length).toBe(5);
      expect(ctx.android.fetchKeystore.mock.calls.length).toBe(1);
      expect(ctx.android.updateKeystore.mock.calls.length).toBe(1);
    });
  });
  describe('no credentials', () => {
    it('should check credentials and generate new', async () => {
      const ctx = getCtxMock({
        android: {
          fetchKeystore: jest.fn().mockImplementationOnce(() => null),
        },
      });

      (prompts as any)
        .mockImplementationOnce(() => ({ answer: false })) // Let expo handle
        .mockImplementation(() => {
          throw new Error("shouldn't happen");
        });

      const view = new UpdateKeystore(testExperienceName);
      const lastView = await view.open(ctx);

      expect(lastView).toBe(null);
      expect((prompts as any).mock.calls.length).toBe(1);
      expect(ctx.android.fetchKeystore.mock.calls.length).toBe(1);
      expect(ctx.android.updateKeystore.mock.calls.length).toBe(1);
    });

    it('should check credentials and ask users for them', async () => {
      const ctx = getCtxMock({
        android: {
          fetchKeystore: jest.fn().mockImplementationOnce(() => null),
        },
      });

      (prompts as any)
        .mockImplementationOnce(() => ({ answer: true })) // user specified
        .mockImplementation(() => ({ input: 'test' })); // keystore credentials

      const view = new UpdateKeystore(testExperienceName);
      const lastView = await view.open(ctx);

      expect(lastView).toBe(null);
      expect((prompts as any).mock.calls.length).toBe(5);
      expect(ctx.android.fetchKeystore.mock.calls.length).toBe(1);
      expect(ctx.android.updateKeystore.mock.calls.length).toBe(1);
    });
  });
});

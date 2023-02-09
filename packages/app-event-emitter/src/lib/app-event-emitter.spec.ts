import { appEventEmitter } from './app-event-emitter';

describe('appEventEmitter', () => {
  it('should work', () => {
    expect(appEventEmitter()).toEqual('app-event-emitter');
  });
});

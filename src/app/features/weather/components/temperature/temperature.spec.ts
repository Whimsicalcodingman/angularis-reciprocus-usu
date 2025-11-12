import { createComponentFactory, Spectator } from '@ngneat/spectator';

import { Temperature } from './temperature';

describe('Temperature', () => {
  let spectator: Spectator<Temperature>;
  const createComponent = createComponentFactory(Temperature);

  beforeEach(() => (spectator = createComponent()));

  it('should create', () => {
    expect(createComponent).toBeTruthy();
  });
});

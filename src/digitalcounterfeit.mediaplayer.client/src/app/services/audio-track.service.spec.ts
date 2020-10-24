import { TestBed } from '@angular/core/testing';

import { AudioTrackService } from './audio-track.service';

describe('AudioTrackService', () => {
  let service: AudioTrackService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AudioTrackService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});

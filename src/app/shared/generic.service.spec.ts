import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { GenericService } from './generic.service';

describe('GenericService', () => {
  let service: GenericService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule], 
      providers: [GenericService]
    });
    service = TestBed.inject(GenericService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should get data', () => {
    const mockData = { data: [] };
    service.get().subscribe((data: any) => {
      expect(data).toEqual(mockData);
    });

    const req = httpMock.expectOne(`${service.url}`);
    expect(req.request.method).toBe('GET');
    req.flush(mockData);
  });

  it('should get data by ID', () => {
    const mockData = { data: {} };
    const id = '1';
    service.getById(id).subscribe((data: any) => {
      expect(data).toEqual(mockData);
    });

    const req = httpMock.expectOne(`${service.url}/${id}`);
    expect(req.request.method).toBe('GET');
    req.flush(mockData);
  });

  it('should post data', () => {
    const mockData = { data: {} };
    const postData = { name: 'test' };
    service.post(postData).subscribe((data: any) => {
      expect(data).toEqual(mockData);
    });

    const req = httpMock.expectOne(`${service.url}`);
    expect(req.request.method).toBe('POST');
    req.flush(mockData);
  });

  it('should put data', () => {
    const mockData = { data: {} };
    const putData = { name: 'test' };
    const id = '1';
    service.put(id, putData).subscribe((data: any) => {
      expect(data).toEqual(mockData);
    });

    const req = httpMock.expectOne(`${service.url}/${id}`);
    expect(req.request.method).toBe('PUT');
    req.flush(mockData);
  });

  it('should delete data', () => {
    const mockData = { data: {} };
    const id = '1';
    service.delete(id).subscribe((data: any) => {
      expect(data).toEqual(mockData);
    });

    const req = httpMock.expectOne(`${service.url}/${id}`);
    expect(req.request.method).toBe('DELETE');
    req.flush(mockData);
  });
});

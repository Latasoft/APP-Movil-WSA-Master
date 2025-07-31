import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { Router } from '@angular/router';
import { AlertController } from '@ionic/angular';
import { SharedFooterComponent } from './shared-footer.component';
import { AuthService } from '../../services/auth.service';
import { TranslationService } from '../../services/translation.service';

describe('SharedFooterComponent', () => {
  let component: SharedFooterComponent;
  let fixture: ComponentFixture<SharedFooterComponent>;
  let mockRouter: jasmine.SpyObj<Router>;
  let mockAlertController: jasmine.SpyObj<AlertController>;
  let mockAuthService: jasmine.SpyObj<AuthService>;
  let mockTranslationService: jasmine.SpyObj<TranslationService>;

  beforeEach(waitForAsync(() => {
    const routerSpy = jasmine.createSpyObj('Router', ['navigate']);
    const alertControllerSpy = jasmine.createSpyObj('AlertController', ['create']);
    const authServiceSpy = jasmine.createSpyObj('AuthService', ['logout']);
    const translationServiceSpy = jasmine.createSpyObj('TranslationService', ['translate']);

    TestBed.configureTestingModule({
      imports: [SharedFooterComponent],
      providers: [
        { provide: Router, useValue: routerSpy },
        { provide: AlertController, useValue: alertControllerSpy },
        { provide: AuthService, useValue: authServiceSpy },
        { provide: TranslationService, useValue: translationServiceSpy }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(SharedFooterComponent);
    component = fixture.componentInstance;
    mockRouter = TestBed.inject(Router) as jasmine.SpyObj<Router>;
    mockAlertController = TestBed.inject(AlertController) as jasmine.SpyObj<AlertController>;
    mockAuthService = TestBed.inject(AuthService) as jasmine.SpyObj<AuthService>;
    mockTranslationService = TestBed.inject(TranslationService) as jasmine.SpyObj<TranslationService>;
    
    mockTranslationService.translate.and.returnValue('Test');
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should navigate to home', () => {
    component.navigateToHome();
    expect(mockRouter.navigate).toHaveBeenCalledWith(['/home']);
  });

  it('should navigate to vessels', () => {
    component.navigateToVessels();
    expect(mockRouter.navigate).toHaveBeenCalledWith(['/lista-embarcaciones']);
  });

  it('should navigate to reports', () => {
    component.navigateToReports();
    expect(mockRouter.navigate).toHaveBeenCalledWith(['/lista-descarga-reportes']);
  });

  it('should navigate to groups', () => {
    component.navigateToGroups();
    expect(mockRouter.navigate).toHaveBeenCalledWith(['/lista-grupos']);
  });

  it('should open logout alert', () => {
    component.confirmLogout();
    expect(component.isAlertOpen).toBe(true);
  });
});
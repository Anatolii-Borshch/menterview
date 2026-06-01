import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import agent from '../../api/agent';
import referenceApi from '../../api/referenceApi';
import type { CategoryDto, LevelDto } from '../../api/models/referenceModels';
import { ROUTES } from '../../constants';
import { RegisterFooter } from './RegisterFooter';
import { RegisterHeader } from './RegisterHeader';
import { RegisterDataForm } from './RegisterDataForm';
import { RegisterPreferencesForm } from './RegisterPreferencesForm';
import { RegisterVerifyForm } from './RegisterVerifyForm';
import { REGISTER_TEXT } from './RegisterConstants';
import { createInitialRegisterForm, getRegisterStepMeta, updateRegisterFormField } from './RegisterHelpers';
import type { RegisterStep } from './RegisterHelpers';

export default function RegisterPage() {
  const navigate = useNavigate();
  const [step, setStep] = useState<RegisterStep>('info');
  const [form, setForm] = useState(createInitialRegisterForm);
  const [code, setCode] = useState('');
  const [loading, setLoading] = useState(false);
  const [categories, setCategories] = useState<CategoryDto[]>([]);
  const [levels, setLevels] = useState<LevelDto[]>([]);
  const [referenceLoading, setReferenceLoading] = useState(false);

  useEffect(() => {
    if (step !== 'preferences') {
      return;
    }

    setReferenceLoading(true);
    Promise.all([referenceApi.getCategories(), referenceApi.getLevels()])
      .then(([categoriesResponse, levelsResponse]) => {
        if (categoriesResponse.data.isSuccess) {
          setCategories(categoriesResponse.data.data);
        }

        if (levelsResponse.data.isSuccess) {
          setLevels(levelsResponse.data.data);
        }
      })
      .catch(() => toast.error(REGISTER_TEXT.REFERENCE_LOAD_FAILED))
      .finally(() => setReferenceLoading(false));
  }, [step]);

  const handleInfoSubmit = (event: { preventDefault: () => void }) => {
    event.preventDefault();
    setStep('preferences');
  };

  const handleRegisterSubmit = async (event: { preventDefault: () => void }) => {
    event.preventDefault();
    if (!form.categoryId) {
      toast.error(REGISTER_TEXT.CATEGORY_REQUIRED);
      return;
    }

    setLoading(true);
    try {
      const response = await agent.auth.register({
        ...form,
        levelId: form.levelId,
      });

      if (response.data.isSuccess) {
        setStep('verify');
      } else {
        response.data.errors.forEach((errorMessage: string) => toast.error(errorMessage));
      }
    } catch {
      toast.error(REGISTER_TEXT.REGISTER_FAILED);
    } finally {
      setLoading(false);
    }
  };

  const handleVerifySubmit = async (event: { preventDefault: () => void }) => {
    event.preventDefault();
    setLoading(true);
    try {
      const response = await agent.auth.verifyEmail({ email: form.email, code });
      if (response.data.isSuccess) {
        navigate(ROUTES.LOGIN, { state: { message: REGISTER_TEXT.VERIFY_SUCCESS } });
      } else {
        response.data.errors.forEach((errorMessage: string) => toast.error(errorMessage));
      }
    } catch {
      toast.error(REGISTER_TEXT.VERIFY_FAILED);
    } finally {
      setLoading(false);
    }
  };

  const stepMeta = getRegisterStepMeta(step, form.email);

  return (
    <div className="flex min-h-[calc(100vh-64px)] items-center justify-center px-4 py-8">
      <div className="w-full max-w-md">
        <RegisterHeader step={step} title={stepMeta.title} subtitle={stepMeta.subtitle} />

        <div className="rounded-2xl border border-periwinkle bg-white p-8 shadow-sm">
          {step === 'info' && (
            <RegisterDataForm
              form={form}
              onSubmit={handleInfoSubmit}
              onFirstNameChange={(value) => setForm((current) => updateRegisterFormField(current, 'firstName', value))}
              onLastNameChange={(value) => setForm((current) => updateRegisterFormField(current, 'lastName', value))}
              onEmailChange={(value) => setForm((current) => updateRegisterFormField(current, 'email', value))}
              onPasswordChange={(value) => setForm((current) => updateRegisterFormField(current, 'password', value))}
            />
          )}

          {step === 'preferences' && (
            <RegisterPreferencesForm
              loading={referenceLoading}
              categories={categories}
              levels={levels}
              selectedCategoryId={form.categoryId}
              selectedLevelId={form.levelId}
              submitting={loading}
              onCategorySelect={(categoryId) => setForm((current) => updateRegisterFormField(current, 'categoryId', categoryId))}
              onLevelToggle={(levelId) =>
                setForm((current) => {
                  const nextLevelId = current.levelId === levelId ? undefined : levelId;
                  return updateRegisterFormField(current, 'levelId', nextLevelId);
                })
              }
              onBack={() => setStep('info')}
              onSubmit={handleRegisterSubmit}
            />
          )}

          {step === 'verify' && (
            <RegisterVerifyForm
              code={code}
              loading={loading}
              onCodeChange={setCode}
              onSubmit={handleVerifySubmit}
              onBack={() => setStep('preferences')}
            />
          )}
        </div>

        {step === 'info' && <RegisterFooter />}
      </div>
    </div>
  );
}

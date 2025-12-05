// ViewModel Layer - New Email ViewModel

import { useState, useCallback, useMemo } from 'react';
import { IEmailRepository } from '@/model/repositories';
import { CreateEmailUseCase } from '@/model/usecases';
import { toast } from '@/hooks/use-toast';
import { EmailRepositorySupabase } from '@/model/repositories/EmailRepositorySupabase';

// State Type
export interface NewEmailFormData {
  sender: string;
  recipient: string;
  subject: string;
  body: string;
  date: Date;
  state: string;
  city: string;
}

export interface UseNewEmailViewModelState {
  formData: NewEmailFormData;
  errors: Record<string, string>;
  isSubmitting: boolean;
}

// Actions Type
export interface UseNewEmailViewModelActions {
  updateField: <K extends keyof NewEmailFormData>(field: K, value: NewEmailFormData[K]) => void;
  submit: () => Promise<boolean>;
  reset: () => void;
}

// ViewModel Return Type
export interface UseNewEmailViewModelReturn {
  state: UseNewEmailViewModelState;
  actions: UseNewEmailViewModelActions;
}

const initialFormData: NewEmailFormData = {
  sender: '',
  recipient: '',
  subject: '',
  body: '',
  date: new Date(),
  state: '',
  city: '',
};

export function useNewEmailViewModel(
  emailRepository: IEmailRepository,
  onEmailCreated: () => void
): UseNewEmailViewModelReturn {
  const [formData, setFormData] = useState<NewEmailFormData>(initialFormData);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const createEmailUseCase = useMemo(
    () => new CreateEmailUseCase(new EmailRepositorySupabase()),
    []
  );

  const validate = useCallback((): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.sender.trim()) {
      newErrors.sender = 'Remetente é obrigatório';
    } else if (!formData.sender.includes('@')) {
      newErrors.sender = 'E-mail inválido';
    }

    if (!formData.recipient.trim()) {
      newErrors.recipient = 'Destinatário é obrigatório';
    } else if (!formData.recipient.includes('@')) {
      newErrors.recipient = 'E-mail inválido';
    }

    if (!formData.subject.trim()) {
      newErrors.subject = 'Assunto é obrigatório';
    }

    if (!formData.body.trim()) {
      newErrors.body = 'Corpo da mensagem é obrigatório';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }, [formData]);

  const updateField = useCallback(<K extends keyof NewEmailFormData>(
    field: K,
    value: NewEmailFormData[K]
  ) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[field];
        return newErrors;
      });
    }
  }, [errors]);

  const submit = useCallback(async (): Promise<boolean> => {
    if (!validate()) {
      toast({
        title: 'Erro de validação',
        description: 'Por favor, preencha todos os campos obrigatórios.',
        variant: 'destructive',
      });
      return false;
    }

    setIsSubmitting(true);
    try {
      await createEmailUseCase.execute({
        sender: formData.sender.trim(),
        recipient: formData.recipient.trim(),
        subject: formData.subject.trim(),
        body: formData.body.trim(),
        date: formData.date,
        state: formData.state || undefined,
        city: formData.city || undefined,
      });

      toast({
        title: 'E-mail cadastrado',
        description: 'O e-mail foi adicionado com sucesso.',
      });

      onEmailCreated();
      return true;
    } catch (err) {
      toast({
        title: 'Erro',
        description: 'Não foi possível cadastrar o e-mail.',
        variant: 'destructive',
      });
      return false;
    } finally {
      setIsSubmitting(false);
    }
  }, [formData, validate, createEmailUseCase, onEmailCreated]);

  const reset = useCallback(() => {
    setFormData(initialFormData);
    setErrors({});
  }, []);

  return {
    state: {
      formData,
      errors,
      isSubmitting,
    },
    actions: {
      updateField,
      submit,
      reset,
    },
  };
}

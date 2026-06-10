import type { ReactNode } from 'react';
import type { UserProfileDto } from '../../api/models/profileModels';
import type { CategoryDto, LevelDto } from '../../api/models/referenceModels';

export type EditMode = null | 'name' | 'category' | 'level';

export interface NameFormState {
  firstName: string;
  lastName: string;
}

export interface InfoRowProps {
  label: string;
  value?: string;
  onEdit?: () => void;
  children?: ReactNode;
}

export interface ProfileAccountSectionProps {
  profile: UserProfileDto;
  editMode: EditMode;
  nameForm: NameFormState;
  saving: boolean;
  onNameChange: (next: NameFormState) => void;
  onOpenEdit: (mode: EditMode) => void;
  onSave: () => void;
  onCancel: () => void;
  memberSince: string;
}

export interface ProfileFocusSectionProps {
  profile: UserProfileDto;
  editMode: EditMode;
  categories: CategoryDto[];
  levels: LevelDto[];
  selectedCategoryId: number;
  selectedLevelId: number | undefined;
  saving: boolean;
  onOpenEdit: (mode: EditMode) => void;
  onSave: () => void;
  onCancel: () => void;
  onCategoryChange: (categoryId: number) => void;
  onLevelChange: (levelId: number | undefined) => void;
}

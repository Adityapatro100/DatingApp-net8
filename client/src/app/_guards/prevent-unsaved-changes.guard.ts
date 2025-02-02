import { CanDeactivateFn } from '@angular/router';
import { MemberEditComponent } from '../members/member-edit/member-edit.component';
import { inject } from '@angular/core';
import { ConfirmService } from '../_services/confirm.service';

export const preventUnsavedChangesGuard: CanDeactivateFn<MemberEditComponent> = (Component) => {
  const confirmService = inject(ConfirmService);
  if (Component.editForm?.dirty){
    return confirmService.confirm() ?? false;
  }
  return true;
};

import { CanActivate, Injectable } from '@nestjs/common'
import { log } from 'console'
import { Observable } from 'rxjs'

@Injectable()
export class OptionalJwtAuthGuard implements CanActivate {
  canActivate(): boolean | Promise<boolean> | Observable<boolean> {
    log('OPTIONAL JWT AUTH GUARD')
    return true
  }
}

import { Routes } from '@angular/router';
import { HomeComponent } from './pages/home/home.component';
import { DetailComponent } from './pages/detail/detail.component';
import { CategoryComponent } from './pages/category/category.component';
import { CartComponent } from './pages/cart/cart.component';
import { LoginComponent } from './pages/login/login.component';
import { SignupComponent } from './pages/signup/signup.component';
import { NotFoundComponent } from './pages/not-found/not-found.component';
import { PayComponent } from './pages/pay/pay.component';
import { HomeComponent as HomeAdminComponent } from './pages/admin/pages/home/home.component';
import { ProductsComponent as ProductAdminComponent } from './pages/admin/components/products/products.component';
import { UserComponent as UserAdminComponent } from './pages/admin/components/user/user.component';
import { OderComponent as OderAdminComponent } from './pages/admin/components/oder/oder.component';
import { ChartComponent as CharAdminComponents } from './pages/admin/components/chart/chart.component';
import { CanActivate, CanActivateAdmin, CanActivateRoles } from './service/canActiveFn.service';
import { ForgotPasswordComponent } from './pages/forgot-password/forgot-password.component';
import { ProfiComponent } from './pages/profi/profi.component';
import { PurchaseComponent } from './pages/purchase/purchase.component';

export const routes: Routes = [
    // user
    { path: '',component : HomeComponent,canActivate:[CanActivateAdmin] },
    { path: 'home',component : HomeComponent },
    { path: 'category',component : CategoryComponent },
    { path: 'cart',component : CartComponent },
    { path: 'products/product-detail/:id', component: DetailComponent },
    { path: 'login', component: LoginComponent },
    { path: 'signup', component: SignupComponent },
    { path: 'forgot-password', component: ForgotPasswordComponent },
    { path: 'pay', component: PayComponent},

    { path: 'user/profile', component: ProfiComponent},
    { path: 'user/purchase', component:PurchaseComponent},

    // canActivate:[CanActivate]

    //profile
    {path: 'profile',component: ProfiComponent,children:[
         
    ]},

    //admin
    { path: 'admin',canActivate:[CanActivateRoles],
        children:[
        { path: 'products',component : ProductAdminComponent },
        { path: 'user',component : UserAdminComponent },
        { path: 'oder',component : OderAdminComponent },
        { path: 'chart',component : CharAdminComponents },
    ] ,
},
    //not-found
    { path: '**', component: NotFoundComponent}
];

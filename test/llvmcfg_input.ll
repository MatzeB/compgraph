; ModuleID = 'ary2.cpp'
source_filename = "ary2.cpp"
target datalayout = "e-m:e-p270:32:32-p271:32:32-p272:64:64-i64:64-f80:128-n8:16:32:64-S128"
target triple = "x86_64-redhat-linux-gnu"

%"class.std::ios_base::Init" = type { i8 }
%"class.std::basic_ostream" = type { ptr, %"class.std::basic_ios" }
%"class.std::basic_ios" = type { %"class.std::ios_base", ptr, i8, i8, ptr, ptr, ptr, ptr }
%"class.std::ios_base" = type { ptr, i64, i64, i32, i32, i32, ptr, %"struct.std::ios_base::_Words", [8 x %"struct.std::ios_base::_Words"], i32, ptr, %"class.std::locale" }
%"struct.std::ios_base::_Words" = type { ptr, i64 }
%"class.std::locale" = type { ptr }
%"class.std::vector" = type { %"struct.std::_Vector_base" }
%"struct.std::_Vector_base" = type { %"struct.std::_Vector_base<int, std::allocator<int>>::_Vector_impl" }
%"struct.std::_Vector_base<int, std::allocator<int>>::_Vector_impl" = type { %"struct.std::_Vector_base<int, std::allocator<int>>::_Vector_impl_data" }
%"struct.std::_Vector_base<int, std::allocator<int>>::_Vector_impl_data" = type { ptr, ptr, ptr }
%"class.std::allocator" = type { i8 }
%"class.std::ctype" = type <{ %"class.std::locale::facet.base", [4 x i8], ptr, i8, [7 x i8], ptr, ptr, ptr, i8, [256 x i8], [256 x i8], i8, [6 x i8] }>
%"class.std::locale::facet.base" = type <{ ptr, i32 }>

$_ZNSt6vectorIiSaIiEEC2EmRKS0_ = comdat any

$_ZNSt15__new_allocatorIiE8allocateEmPKv = comdat any

$__llvm_profile_raw_version = comdat any

@_ZStL8__ioinit = internal global %"class.std::ios_base::Init" zeroinitializer, align 1
@__dso_handle = external hidden global i8
@_ZSt4cout = external dso_local global %"class.std::basic_ostream", align 8
@.str = private unnamed_addr constant [49 x i8] c"cannot create std::vector larger than max_size()\00", align 1
@llvm.global_ctors = appending global [1 x { i32, ptr, ptr }] [{ i32, ptr, ptr } { i32 65535, ptr @_GLOBAL__sub_I_ary2.cpp, ptr null }]
@__llvm_profile_raw_version = hidden constant i64 72057594037927944, comdat
@__profn_main = private constant [4 x i8] c"main"
@__profn__ZNSt6vectorIiSaIiEEC2EmRKS0_ = linkonce_odr hidden constant [29 x i8] c"_ZNSt6vectorIiSaIiEEC2EmRKS0_"
@__profn__ZNSt15__new_allocatorIiE8allocateEmPKv = linkonce_odr hidden constant [39 x i8] c"_ZNSt15__new_allocatorIiE8allocateEmPKv"
@__profn__ZNKSt9basic_iosIcSt11char_traitsIcEE5widenEc = linkonce_odr hidden constant [45 x i8] c"_ZNKSt9basic_iosIcSt11char_traitsIcEE5widenEc"
@__profn_ary2.cpp__GLOBAL__sub_I_ary2.cpp = private constant [32 x i8] c"ary2.cpp;_GLOBAL__sub_I_ary2.cpp"

declare dso_local void @_ZNSt8ios_base4InitC1Ev(ptr noundef nonnull align 1 dereferenceable(1)) unnamed_addr #0

; Function Attrs: nounwind
declare dso_local void @_ZNSt8ios_base4InitD1Ev(ptr noundef nonnull align 1 dereferenceable(1)) unnamed_addr #1

; Function Attrs: nofree nounwind
declare dso_local i32 @__cxa_atexit(ptr, ptr, ptr) local_unnamed_addr #2

; Function Attrs: norecurse uwtable
define dso_local noundef i32 @main(i32 noundef %argc, ptr noundef %argv) local_unnamed_addr #3 personality ptr @__gxx_personality_v0 {
entry:
  %x = alloca %"class.std::vector", align 8
  %ref.tmp = alloca %"class.std::allocator", align 1
  %y = alloca %"class.std::vector", align 8
  %ref.tmp2 = alloca %"class.std::allocator", align 1
  %cmp = icmp eq i32 %argc, 2
  br i1 %cmp, label %cond.true, label %cond.end

cond.true:                                        ; preds = %entry
  call void @llvm.instrprof.increment(ptr @__profn_main, i64 701607649431911460, i32 13, i32 8)
  %arrayidx = getelementptr inbounds ptr, ptr %argv, i64 1
  %0 = load ptr, ptr %arrayidx, align 8, !tbaa !3
  %call.i = call i64 @strtol(ptr nocapture noundef nonnull %0, ptr noundef null, i32 noundef 10) #11
  %conv.i = trunc i64 %call.i to i32
  %1 = mul nsw i32 %conv.i, 10
  br label %cond.end

cond.end:                                         ; preds = %entry, %cond.true
  %cond = phi i32 [ %1, %cond.true ], [ 9000000, %entry ]
  call void @llvm.lifetime.start.p0(i64 24, ptr nonnull %x) #11
  %conv = sext i32 %cond to i64
  call void @llvm.lifetime.start.p0(i64 1, ptr nonnull %ref.tmp) #11
  call void @_ZNSt6vectorIiSaIiEEC2EmRKS0_(ptr noundef nonnull align 8 dereferenceable(24) %x, i64 noundef %conv, ptr noundef nonnull align 1 dereferenceable(1) %ref.tmp)
  call void @llvm.lifetime.end.p0(i64 1, ptr nonnull %ref.tmp) #11
  call void @llvm.lifetime.start.p0(i64 24, ptr nonnull %y) #11
  call void @llvm.lifetime.start.p0(i64 1, ptr nonnull %ref.tmp2) #11
  invoke void @_ZNSt6vectorIiSaIiEEC2EmRKS0_(ptr noundef nonnull align 8 dereferenceable(24) %y, i64 noundef %conv, ptr noundef nonnull align 1 dereferenceable(1) %ref.tmp2)
          to label %invoke.cont4 unwind label %lpad3

invoke.cont4:                                     ; preds = %cond.end
  call void @llvm.lifetime.end.p0(i64 1, ptr nonnull %ref.tmp2) #11
  br label %for.cond

for.cond:                                         ; preds = %for.body, %invoke.cont4
  %i.0 = phi i32 [ 0, %invoke.cont4 ], [ %inc34, %for.body ]
  %cmp5 = icmp slt i32 %i.0, %cond
  br i1 %cmp5, label %for.body, label %for.cond36

for.body:                                         ; preds = %for.cond
  call void @llvm.instrprof.increment(ptr @__profn_main, i64 701607649431911460, i32 13, i32 0)
  %conv6 = zext i32 %i.0 to i64
  %2 = load ptr, ptr %x, align 8, !tbaa !7
  %add.ptr.i = getelementptr inbounds i32, ptr %2, i64 %conv6
  store i32 %i.0, ptr %add.ptr.i, align 4, !tbaa !9
  %inc = or i32 %i.0, 1
  %conv8 = zext i32 %inc to i64
  %add.ptr.i165 = getelementptr inbounds i32, ptr %2, i64 %conv8
  store i32 %inc, ptr %add.ptr.i165, align 4, !tbaa !9
  %inc10 = add nuw nsw i32 %i.0, 2
  %conv11 = zext i32 %inc10 to i64
  %3 = load ptr, ptr %x, align 8, !tbaa !7
  %add.ptr.i166 = getelementptr inbounds i32, ptr %3, i64 %conv11
  store i32 %inc10, ptr %add.ptr.i166, align 4, !tbaa !9
  %inc13 = add nuw nsw i32 %i.0, 3
  %conv14 = zext i32 %inc13 to i64
  %add.ptr.i167 = getelementptr inbounds i32, ptr %3, i64 %conv14
  store i32 %inc13, ptr %add.ptr.i167, align 4, !tbaa !9
  %inc16 = add nuw nsw i32 %i.0, 4
  %conv17 = zext i32 %inc16 to i64
  %4 = load ptr, ptr %x, align 8, !tbaa !7
  %add.ptr.i168 = getelementptr inbounds i32, ptr %4, i64 %conv17
  store i32 %inc16, ptr %add.ptr.i168, align 4, !tbaa !9
  %inc19 = add nuw nsw i32 %i.0, 5
  %conv20 = zext i32 %inc19 to i64
  %add.ptr.i169 = getelementptr inbounds i32, ptr %4, i64 %conv20
  store i32 %inc19, ptr %add.ptr.i169, align 4, !tbaa !9
  %inc22 = add nuw nsw i32 %i.0, 6
  %conv23 = zext i32 %inc22 to i64
  %5 = load ptr, ptr %x, align 8, !tbaa !7
  %add.ptr.i170 = getelementptr inbounds i32, ptr %5, i64 %conv23
  store i32 %inc22, ptr %add.ptr.i170, align 4, !tbaa !9
  %inc25 = add nuw nsw i32 %i.0, 7
  %conv26 = zext i32 %inc25 to i64
  %add.ptr.i171 = getelementptr inbounds i32, ptr %5, i64 %conv26
  store i32 %inc25, ptr %add.ptr.i171, align 4, !tbaa !9
  %inc28 = add nuw nsw i32 %i.0, 8
  %conv29 = zext i32 %inc28 to i64
  %6 = load ptr, ptr %x, align 8, !tbaa !7
  %add.ptr.i172 = getelementptr inbounds i32, ptr %6, i64 %conv29
  store i32 %inc28, ptr %add.ptr.i172, align 4, !tbaa !9
  %inc31 = add nuw nsw i32 %i.0, 9
  %conv32 = zext i32 %inc31 to i64
  %add.ptr.i173 = getelementptr inbounds i32, ptr %6, i64 %conv32
  store i32 %inc31, ptr %add.ptr.i173, align 4, !tbaa !9
  %inc34 = add nuw nsw i32 %i.0, 10
  br label %for.cond, !llvm.loop !11

lpad3:                                            ; preds = %cond.end
  %7 = landingpad { ptr, i32 }
          cleanup
  call void @llvm.instrprof.increment(ptr @__profn_main, i64 701607649431911460, i32 13, i32 12)
  call void @llvm.lifetime.end.p0(i64 1, ptr nonnull %ref.tmp2) #11
  br label %ehcleanup

for.cond36:                                       ; preds = %for.cond, %for.body38
  %i35.0.in = phi i32 [ %dec82, %for.body38 ], [ %cond, %for.cond ]
  %cmp37 = icmp sgt i32 %i35.0.in, 0
  br i1 %cmp37, label %for.body38, label %for.cond.cleanup

for.cond.cleanup:                                 ; preds = %for.cond36
  %_M_finish.i.i = getelementptr inbounds %"struct.std::_Vector_base<int, std::allocator<int>>::_Vector_impl_data", ptr %y, i64 0, i32 1
  %8 = load ptr, ptr %_M_finish.i.i, align 8, !tbaa !3
  %add.ptr.i.i = getelementptr inbounds i32, ptr %8, i64 -1
  %9 = load i32, ptr %add.ptr.i.i, align 4, !tbaa !9
  %call92 = invoke noundef nonnull align 8 dereferenceable(8) ptr @_ZNSolsEi(ptr noundef nonnull align 8 dereferenceable(8) @_ZSt4cout, i32 noundef %9)
          to label %invoke.cont91 unwind label %lpad90

for.body38:                                       ; preds = %for.cond36
  call void @llvm.instrprof.increment(ptr @__profn_main, i64 701607649431911460, i32 13, i32 1)
  %i35.0 = add nsw i32 %i35.0.in, -1
  %conv39 = zext i32 %i35.0 to i64
  %10 = load ptr, ptr %x, align 8, !tbaa !7
  %add.ptr.i174 = getelementptr inbounds i32, ptr %10, i64 %conv39
  %11 = load i32, ptr %add.ptr.i174, align 4, !tbaa !9
  %12 = load ptr, ptr %y, align 8, !tbaa !7
  %add.ptr.i175 = getelementptr inbounds i32, ptr %12, i64 %conv39
  store i32 %11, ptr %add.ptr.i175, align 4, !tbaa !9
  %dec = add nsw i32 %i35.0.in, -2
  %conv43 = sext i32 %dec to i64
  %13 = load ptr, ptr %x, align 8, !tbaa !7
  %add.ptr.i176 = getelementptr inbounds i32, ptr %13, i64 %conv43
  %14 = load i32, ptr %add.ptr.i176, align 4, !tbaa !9
  %15 = load ptr, ptr %y, align 8, !tbaa !7
  %add.ptr.i177 = getelementptr inbounds i32, ptr %15, i64 %conv43
  store i32 %14, ptr %add.ptr.i177, align 4, !tbaa !9
  %dec47 = add nsw i32 %i35.0.in, -3
  %conv48 = sext i32 %dec47 to i64
  %16 = load ptr, ptr %x, align 8, !tbaa !7
  %add.ptr.i178 = getelementptr inbounds i32, ptr %16, i64 %conv48
  %17 = load i32, ptr %add.ptr.i178, align 4, !tbaa !9
  %18 = load ptr, ptr %y, align 8, !tbaa !7
  %add.ptr.i179 = getelementptr inbounds i32, ptr %18, i64 %conv48
  store i32 %17, ptr %add.ptr.i179, align 4, !tbaa !9
  %dec52 = add nsw i32 %i35.0.in, -4
  %conv53 = sext i32 %dec52 to i64
  %19 = load ptr, ptr %x, align 8, !tbaa !7
  %add.ptr.i180 = getelementptr inbounds i32, ptr %19, i64 %conv53
  %20 = load i32, ptr %add.ptr.i180, align 4, !tbaa !9
  %21 = load ptr, ptr %y, align 8, !tbaa !7
  %add.ptr.i181 = getelementptr inbounds i32, ptr %21, i64 %conv53
  store i32 %20, ptr %add.ptr.i181, align 4, !tbaa !9
  %dec57 = add nsw i32 %i35.0.in, -5
  %conv58 = sext i32 %dec57 to i64
  %22 = load ptr, ptr %x, align 8, !tbaa !7
  %add.ptr.i182 = getelementptr inbounds i32, ptr %22, i64 %conv58
  %23 = load i32, ptr %add.ptr.i182, align 4, !tbaa !9
  %24 = load ptr, ptr %y, align 8, !tbaa !7
  %add.ptr.i183 = getelementptr inbounds i32, ptr %24, i64 %conv58
  store i32 %23, ptr %add.ptr.i183, align 4, !tbaa !9
  %dec62 = add nsw i32 %i35.0.in, -6
  %conv63 = sext i32 %dec62 to i64
  %25 = load ptr, ptr %x, align 8, !tbaa !7
  %add.ptr.i184 = getelementptr inbounds i32, ptr %25, i64 %conv63
  %26 = load i32, ptr %add.ptr.i184, align 4, !tbaa !9
  %27 = load ptr, ptr %y, align 8, !tbaa !7
  %add.ptr.i185 = getelementptr inbounds i32, ptr %27, i64 %conv63
  store i32 %26, ptr %add.ptr.i185, align 4, !tbaa !9
  %dec67 = add nsw i32 %i35.0.in, -7
  %conv68 = sext i32 %dec67 to i64
  %28 = load ptr, ptr %x, align 8, !tbaa !7
  %add.ptr.i186 = getelementptr inbounds i32, ptr %28, i64 %conv68
  %29 = load i32, ptr %add.ptr.i186, align 4, !tbaa !9
  %30 = load ptr, ptr %y, align 8, !tbaa !7
  %add.ptr.i187 = getelementptr inbounds i32, ptr %30, i64 %conv68
  store i32 %29, ptr %add.ptr.i187, align 4, !tbaa !9
  %dec72 = add nsw i32 %i35.0.in, -8
  %conv73 = sext i32 %dec72 to i64
  %31 = load ptr, ptr %x, align 8, !tbaa !7
  %add.ptr.i188 = getelementptr inbounds i32, ptr %31, i64 %conv73
  %32 = load i32, ptr %add.ptr.i188, align 4, !tbaa !9
  %33 = load ptr, ptr %y, align 8, !tbaa !7
  %add.ptr.i189 = getelementptr inbounds i32, ptr %33, i64 %conv73
  store i32 %32, ptr %add.ptr.i189, align 4, !tbaa !9
  %dec77 = add nsw i32 %i35.0.in, -9
  %conv78 = sext i32 %dec77 to i64
  %34 = load ptr, ptr %x, align 8, !tbaa !7
  %add.ptr.i190 = getelementptr inbounds i32, ptr %34, i64 %conv78
  %35 = load i32, ptr %add.ptr.i190, align 4, !tbaa !9
  %36 = load ptr, ptr %y, align 8, !tbaa !7
  %add.ptr.i191 = getelementptr inbounds i32, ptr %36, i64 %conv78
  store i32 %35, ptr %add.ptr.i191, align 4, !tbaa !9
  %dec82 = add nsw i32 %i35.0.in, -10
  %conv83 = sext i32 %dec82 to i64
  %37 = load ptr, ptr %x, align 8, !tbaa !7
  %add.ptr.i192 = getelementptr inbounds i32, ptr %37, i64 %conv83
  %38 = load i32, ptr %add.ptr.i192, align 4, !tbaa !9
  %39 = load ptr, ptr %y, align 8, !tbaa !7
  %add.ptr.i193 = getelementptr inbounds i32, ptr %39, i64 %conv83
  store i32 %38, ptr %add.ptr.i193, align 4, !tbaa !9
  br label %for.cond36, !llvm.loop !13

invoke.cont91:                                    ; preds = %for.cond.cleanup
  call void @llvm.instrprof.increment(ptr @__profn_main, i64 701607649431911460, i32 13, i32 2)
  %vtable.i = load ptr, ptr %call92, align 8, !tbaa !14
  %vbase.offset.ptr.i = getelementptr i8, ptr %vtable.i, i64 -24
  %vbase.offset.i = load i64, ptr %vbase.offset.ptr.i, align 8
  %add.ptr.i205 = getelementptr inbounds i8, ptr %call92, i64 %vbase.offset.i
  %call.i206207 = invoke noundef signext i8 @_ZNKSt9basic_iosIcSt11char_traitsIcEE5widenEc(ptr noundef nonnull align 8 dereferenceable(264) %add.ptr.i205, i8 noundef signext 10)
          to label %call.i206.noexc unwind label %lpad90

call.i206.noexc:                                  ; preds = %invoke.cont91
  call void @llvm.instrprof.increment(ptr @__profn_main, i64 701607649431911460, i32 13, i32 3)
  %call1.i208 = invoke noundef nonnull align 8 dereferenceable(8) ptr @_ZNSo3putEc(ptr noundef nonnull align 8 dereferenceable(8) %call92, i8 noundef signext %call.i206207)
          to label %call1.i.noexc unwind label %lpad90

call1.i.noexc:                                    ; preds = %call.i206.noexc
  call void @llvm.instrprof.increment(ptr @__profn_main, i64 701607649431911460, i32 13, i32 4)
  %call.i.i209 = invoke noundef nonnull align 8 dereferenceable(8) ptr @_ZNSo5flushEv(ptr noundef nonnull align 8 dereferenceable(8) %call1.i208)
          to label %invoke.cont93 unwind label %lpad90

invoke.cont93:                                    ; preds = %call1.i.noexc
  call void @llvm.instrprof.increment(ptr @__profn_main, i64 701607649431911460, i32 13, i32 5)
  %40 = load ptr, ptr %y, align 8, !tbaa !7
  %tobool.not.i.i.i = icmp eq ptr %40, null
  br i1 %tobool.not.i.i.i, label %_ZNSt6vectorIiSaIiEED2Ev.exit, label %if.then.i.i.i

if.then.i.i.i:                                    ; preds = %invoke.cont93
  call void @llvm.instrprof.increment(ptr @__profn_main, i64 701607649431911460, i32 13, i32 6)
  call void @_ZdlPv(ptr noundef %40) #12
  br label %_ZNSt6vectorIiSaIiEED2Ev.exit

_ZNSt6vectorIiSaIiEED2Ev.exit:                    ; preds = %invoke.cont93, %if.then.i.i.i
  call void @llvm.lifetime.end.p0(i64 24, ptr nonnull %y) #11
  %41 = load ptr, ptr %x, align 8, !tbaa !7
  %tobool.not.i.i.i196 = icmp eq ptr %41, null
  br i1 %tobool.not.i.i.i196, label %_ZNSt6vectorIiSaIiEED2Ev.exit198, label %if.then.i.i.i197

if.then.i.i.i197:                                 ; preds = %_ZNSt6vectorIiSaIiEED2Ev.exit
  call void @llvm.instrprof.increment(ptr @__profn_main, i64 701607649431911460, i32 13, i32 7)
  call void @_ZdlPv(ptr noundef %41) #12
  br label %_ZNSt6vectorIiSaIiEED2Ev.exit198

_ZNSt6vectorIiSaIiEED2Ev.exit198:                 ; preds = %_ZNSt6vectorIiSaIiEED2Ev.exit, %if.then.i.i.i197
  call void @llvm.lifetime.end.p0(i64 24, ptr nonnull %x) #11
  ret i32 0

lpad90:                                           ; preds = %call1.i.noexc, %call.i206.noexc, %invoke.cont91, %for.cond.cleanup
  %42 = landingpad { ptr, i32 }
          cleanup
  %43 = load ptr, ptr %y, align 8, !tbaa !7
  %tobool.not.i.i.i199 = icmp eq ptr %43, null
  br i1 %tobool.not.i.i.i199, label %ehcleanup, label %if.then.i.i.i200

if.then.i.i.i200:                                 ; preds = %lpad90
  call void @llvm.instrprof.increment(ptr @__profn_main, i64 701607649431911460, i32 13, i32 11)
  call void @_ZdlPv(ptr noundef %43) #12
  br label %ehcleanup

ehcleanup:                                        ; preds = %if.then.i.i.i200, %lpad90, %lpad3
  %.pn = phi { ptr, i32 } [ %7, %lpad3 ], [ %42, %lpad90 ], [ %42, %if.then.i.i.i200 ]
  call void @llvm.lifetime.end.p0(i64 24, ptr nonnull %y) #11
  %44 = load ptr, ptr %x, align 8, !tbaa !7
  %tobool.not.i.i.i202 = icmp eq ptr %44, null
  br i1 %tobool.not.i.i.i202, label %ehcleanup96, label %if.then.i.i.i203

if.then.i.i.i203:                                 ; preds = %ehcleanup
  call void @llvm.instrprof.increment(ptr @__profn_main, i64 701607649431911460, i32 13, i32 10)
  call void @_ZdlPv(ptr noundef %44) #12
  br label %ehcleanup96

ehcleanup96:                                      ; preds = %if.then.i.i.i203, %ehcleanup
  call void @llvm.instrprof.increment(ptr @__profn_main, i64 701607649431911460, i32 13, i32 9)
  call void @llvm.lifetime.end.p0(i64 24, ptr nonnull %x) #11
  resume { ptr, i32 } %.pn
}

; Function Attrs: mustprogress nocallback nofree nosync nounwind willreturn memory(argmem: readwrite)
declare void @llvm.lifetime.start.p0(i64 immarg, ptr nocapture) #4

; Function Attrs: uwtable
define linkonce_odr dso_local void @_ZNSt6vectorIiSaIiEEC2EmRKS0_(ptr noundef nonnull align 8 dereferenceable(24) %this, i64 noundef %__n, ptr noundef nonnull align 1 dereferenceable(1) %__a) unnamed_addr #5 comdat align 2 personality ptr @__gxx_personality_v0 {
entry:
  %cmp.i = icmp ugt i64 %__n, 2305843009213693951
  br i1 %cmp.i, label %if.then.i, label %_ZNSt6vectorIiSaIiEE17_S_check_init_lenEmRKS0_.exit

if.then.i:                                        ; preds = %entry
  call void @llvm.instrprof.increment(ptr @__profn__ZNSt6vectorIiSaIiEEC2EmRKS0_, i64 694937221278780740, i32 6, i32 5)
  call void @_ZSt20__throw_length_errorPKc(ptr noundef nonnull @.str) #13
  unreachable

_ZNSt6vectorIiSaIiEE17_S_check_init_lenEmRKS0_.exit: ; preds = %entry
  call void @llvm.instrprof.increment(ptr @__profn__ZNSt6vectorIiSaIiEEC2EmRKS0_, i64 694937221278780740, i32 6, i32 1)
  store ptr null, ptr %this, align 8, !tbaa !7
  %_M_finish.i.i.i = getelementptr inbounds %"struct.std::_Vector_base<int, std::allocator<int>>::_Vector_impl_data", ptr %this, i64 0, i32 1
  store ptr null, ptr %_M_finish.i.i.i, align 8, !tbaa !16
  %_M_end_of_storage.i.i.i = getelementptr inbounds %"struct.std::_Vector_base<int, std::allocator<int>>::_Vector_impl_data", ptr %this, i64 0, i32 2
  store ptr null, ptr %_M_end_of_storage.i.i.i, align 8, !tbaa !17
  %cmp.not.i.i.i = icmp eq i64 %__n, 0
  br i1 %cmp.not.i.i.i, label %_ZNSt12_Vector_baseIiSaIiEEC2EmRKS0_.exit, label %cond.true.i.i.i

cond.true.i.i.i:                                  ; preds = %_ZNSt6vectorIiSaIiEE17_S_check_init_lenEmRKS0_.exit
  call void @llvm.instrprof.increment(ptr @__profn__ZNSt6vectorIiSaIiEEC2EmRKS0_, i64 694937221278780740, i32 6, i32 2)
  %call.i.i.i3.i = call noundef ptr @_ZNSt15__new_allocatorIiE8allocateEmPKv(ptr noundef nonnull align 1 dereferenceable(1) %this, i64 noundef %__n, ptr noundef null)
  br label %_ZNSt12_Vector_baseIiSaIiEEC2EmRKS0_.exit

_ZNSt12_Vector_baseIiSaIiEEC2EmRKS0_.exit:        ; preds = %_ZNSt6vectorIiSaIiEE17_S_check_init_lenEmRKS0_.exit, %cond.true.i.i.i
  %cond.i.i.i = phi ptr [ null, %_ZNSt6vectorIiSaIiEE17_S_check_init_lenEmRKS0_.exit ], [ %call.i.i.i3.i, %cond.true.i.i.i ]
  store ptr %cond.i.i.i, ptr %this, align 8, !tbaa !7
  store ptr %cond.i.i.i, ptr %_M_finish.i.i.i, align 8, !tbaa !16
  %add.ptr.i.i = getelementptr inbounds i32, ptr %cond.i.i.i, i64 %__n
  store ptr %add.ptr.i.i, ptr %_M_end_of_storage.i.i.i, align 8, !tbaa !17
  br i1 %cmp.not.i.i.i, label %_ZNSt6vectorIiSaIiEE21_M_default_initializeEm.exit, label %if.then.i.i.i.i

if.then.i.i.i.i:                                  ; preds = %_ZNSt12_Vector_baseIiSaIiEEC2EmRKS0_.exit
  call void @llvm.instrprof.increment(ptr @__profn__ZNSt6vectorIiSaIiEEC2EmRKS0_, i64 694937221278780740, i32 6, i32 3)
  store i32 0, ptr %cond.i.i.i, align 4, !tbaa !9
  %incdec.ptr.i.i.i.i = getelementptr inbounds i32, ptr %cond.i.i.i, i64 1
  %cmp.i.i.i.i.i.i = icmp eq i64 %__n, 1
  br i1 %cmp.i.i.i.i.i.i, label %_ZNSt6vectorIiSaIiEE21_M_default_initializeEm.exit, label %if.end.i.i.i.i.i.i

if.end.i.i.i.i.i.i:                               ; preds = %if.then.i.i.i.i
  call void @llvm.instrprof.increment(ptr @__profn__ZNSt6vectorIiSaIiEEC2EmRKS0_, i64 694937221278780740, i32 6, i32 4)
  %add.ptr.i.i.i.i.i.i = getelementptr inbounds i32, ptr %cond.i.i.i, i64 %__n
  br label %for.cond.i.i.i.i.i.i.i.i

for.cond.i.i.i.i.i.i.i.i:                         ; preds = %for.body.i.i.i.i.i.i.i.i, %if.end.i.i.i.i.i.i
  %__first.addr.0.i.i.i.i.i.i.i.i = phi ptr [ %incdec.ptr.i.i.i.i, %if.end.i.i.i.i.i.i ], [ %incdec.ptr.i.i.i.i.i.i.i.i, %for.body.i.i.i.i.i.i.i.i ]
  %cmp.not.i.i.i.i.i.i.i.i = icmp eq ptr %__first.addr.0.i.i.i.i.i.i.i.i, %add.ptr.i.i.i.i.i.i
  br i1 %cmp.not.i.i.i.i.i.i.i.i, label %_ZNSt6vectorIiSaIiEE21_M_default_initializeEm.exit, label %for.body.i.i.i.i.i.i.i.i

for.body.i.i.i.i.i.i.i.i:                         ; preds = %for.cond.i.i.i.i.i.i.i.i
  call void @llvm.instrprof.increment(ptr @__profn__ZNSt6vectorIiSaIiEEC2EmRKS0_, i64 694937221278780740, i32 6, i32 0)
  store i32 0, ptr %__first.addr.0.i.i.i.i.i.i.i.i, align 4, !tbaa !9
  %incdec.ptr.i.i.i.i.i.i.i.i = getelementptr inbounds i32, ptr %__first.addr.0.i.i.i.i.i.i.i.i, i64 1
  br label %for.cond.i.i.i.i.i.i.i.i, !llvm.loop !18

_ZNSt6vectorIiSaIiEE21_M_default_initializeEm.exit: ; preds = %_ZNSt12_Vector_baseIiSaIiEEC2EmRKS0_.exit, %if.then.i.i.i.i, %for.cond.i.i.i.i.i.i.i.i
  %__first.addr.0.i.i.i.i = phi ptr [ %cond.i.i.i, %_ZNSt12_Vector_baseIiSaIiEEC2EmRKS0_.exit ], [ %incdec.ptr.i.i.i.i, %if.then.i.i.i.i ], [ %add.ptr.i.i.i.i.i.i, %for.cond.i.i.i.i.i.i.i.i ]
  store ptr %__first.addr.0.i.i.i.i, ptr %_M_finish.i.i.i, align 8, !tbaa !16
  ret void
}

declare dso_local i32 @__gxx_personality_v0(...)

; Function Attrs: mustprogress nocallback nofree nosync nounwind willreturn memory(argmem: readwrite)
declare void @llvm.lifetime.end.p0(i64 immarg, ptr nocapture) #4

declare dso_local noundef nonnull align 8 dereferenceable(8) ptr @_ZNSolsEi(ptr noundef nonnull align 8 dereferenceable(8), i32 noundef) local_unnamed_addr #0

; Function Attrs: mustprogress nofree nounwind willreturn
declare dso_local i64 @strtol(ptr noundef readonly, ptr nocapture noundef, i32 noundef) local_unnamed_addr #6

; Function Attrs: noreturn
declare dso_local void @_ZSt20__throw_length_errorPKc(ptr noundef) local_unnamed_addr #7

; Function Attrs: mustprogress uwtable
define linkonce_odr dso_local noundef ptr @_ZNSt15__new_allocatorIiE8allocateEmPKv(ptr noundef nonnull align 1 dereferenceable(1) %this, i64 noundef %__n, ptr noundef %0) local_unnamed_addr #8 comdat align 2 {
entry:
  call void @llvm.instrprof.increment(ptr @__profn__ZNSt15__new_allocatorIiE8allocateEmPKv, i64 238984481941143025, i32 3, i32 0)
  %cmp = icmp ugt i64 %__n, 2305843009213693951
  br i1 %cmp, label %if.then, label %if.end4, !prof !19

if.then:                                          ; preds = %entry
  %cmp2 = icmp ugt i64 %__n, 4611686018427387903
  br i1 %cmp2, label %if.then3, label %if.end

if.then3:                                         ; preds = %if.then
  call void @llvm.instrprof.increment(ptr @__profn__ZNSt15__new_allocatorIiE8allocateEmPKv, i64 238984481941143025, i32 3, i32 1)
  call void @_ZSt28__throw_bad_array_new_lengthv() #13
  unreachable

if.end:                                           ; preds = %if.then
  call void @llvm.instrprof.increment(ptr @__profn__ZNSt15__new_allocatorIiE8allocateEmPKv, i64 238984481941143025, i32 3, i32 2)
  call void @_ZSt17__throw_bad_allocv() #13
  unreachable

if.end4:                                          ; preds = %entry
  %mul = shl i64 %__n, 2
  %call5 = call noalias noundef nonnull ptr @_Znwm(i64 noundef %mul) #14
  ret ptr %call5
}

; Function Attrs: noreturn
declare dso_local void @_ZSt28__throw_bad_array_new_lengthv() local_unnamed_addr #7

; Function Attrs: noreturn
declare dso_local void @_ZSt17__throw_bad_allocv() local_unnamed_addr #7

; Function Attrs: nobuiltin allocsize(0)
declare dso_local noundef nonnull ptr @_Znwm(i64 noundef) local_unnamed_addr #9

; Function Attrs: nobuiltin nounwind
declare dso_local void @_ZdlPv(ptr noundef) local_unnamed_addr #10

declare dso_local noundef nonnull align 8 dereferenceable(8) ptr @_ZNSo3putEc(ptr noundef nonnull align 8 dereferenceable(8), i8 noundef signext) local_unnamed_addr #0

; Function Attrs: mustprogress uwtable
define available_externally dso_local noundef signext i8 @_ZNKSt9basic_iosIcSt11char_traitsIcEE5widenEc(ptr noundef nonnull align 8 dereferenceable(264) %this, i8 noundef signext %__c) local_unnamed_addr #8 align 2 {
entry:
  %_M_ctype = getelementptr inbounds %"class.std::basic_ios", ptr %this, i64 0, i32 5
  %0 = load ptr, ptr %_M_ctype, align 8, !tbaa !20
  %tobool.not.i = icmp eq ptr %0, null
  br i1 %tobool.not.i, label %if.then.i, label %_ZSt13__check_facetISt5ctypeIcEERKT_PS3_.exit

if.then.i:                                        ; preds = %entry
  call void @llvm.instrprof.increment(ptr @__profn__ZNKSt9basic_iosIcSt11char_traitsIcEE5widenEc, i64 543243708862749142, i32 3, i32 2)
  call void @_ZSt16__throw_bad_castv() #13
  unreachable

_ZSt13__check_facetISt5ctypeIcEERKT_PS3_.exit:    ; preds = %entry
  %_M_widen_ok.i = getelementptr inbounds %"class.std::ctype", ptr %0, i64 0, i32 8
  %1 = load i8, ptr %_M_widen_ok.i, align 8, !tbaa !29
  %tobool.not.i3 = icmp eq i8 %1, 0
  br i1 %tobool.not.i3, label %if.end.i, label %if.then.i4

if.then.i4:                                       ; preds = %_ZSt13__check_facetISt5ctypeIcEERKT_PS3_.exit
  call void @llvm.instrprof.increment(ptr @__profn__ZNKSt9basic_iosIcSt11char_traitsIcEE5widenEc, i64 543243708862749142, i32 3, i32 0)
  %idxprom.i = zext i8 %__c to i64
  %arrayidx.i = getelementptr inbounds %"class.std::ctype", ptr %0, i64 0, i32 9, i64 %idxprom.i
  %2 = load i8, ptr %arrayidx.i, align 1, !tbaa !32
  br label %_ZNKSt5ctypeIcE5widenEc.exit

if.end.i:                                         ; preds = %_ZSt13__check_facetISt5ctypeIcEERKT_PS3_.exit
  call void @llvm.instrprof.increment(ptr @__profn__ZNKSt9basic_iosIcSt11char_traitsIcEE5widenEc, i64 543243708862749142, i32 3, i32 1)
  call void @_ZNKSt5ctypeIcE13_M_widen_initEv(ptr noundef nonnull align 8 dereferenceable(570) %0)
  %vtable.i = load ptr, ptr %0, align 8, !tbaa !14
  %vfn.i = getelementptr inbounds ptr, ptr %vtable.i, i64 6
  %3 = load ptr, ptr %vfn.i, align 8
  %4 = ptrtoint ptr %3 to i64
  call void @llvm.instrprof.value.profile(ptr @__profn__ZNKSt9basic_iosIcSt11char_traitsIcEE5widenEc, i64 543243708862749142, i64 %4, i32 0, i32 0)
  %call.i = call noundef signext i8 %3(ptr noundef nonnull align 8 dereferenceable(570) %0, i8 noundef signext %__c)
  br label %_ZNKSt5ctypeIcE5widenEc.exit

_ZNKSt5ctypeIcE5widenEc.exit:                     ; preds = %if.then.i4, %if.end.i
  %retval.0.i = phi i8 [ %2, %if.then.i4 ], [ %call.i, %if.end.i ]
  ret i8 %retval.0.i
}

declare dso_local noundef nonnull align 8 dereferenceable(8) ptr @_ZNSo5flushEv(ptr noundef nonnull align 8 dereferenceable(8)) local_unnamed_addr #0

; Function Attrs: noreturn
declare dso_local void @_ZSt16__throw_bad_castv() local_unnamed_addr #7

declare dso_local void @_ZNKSt5ctypeIcE13_M_widen_initEv(ptr noundef nonnull align 8 dereferenceable(570)) local_unnamed_addr #0

; Function Attrs: uwtable
define internal void @_GLOBAL__sub_I_ary2.cpp() #5 section ".text.startup" {
entry:
  call void @llvm.instrprof.increment(ptr @__profn_ary2.cpp__GLOBAL__sub_I_ary2.cpp, i64 742261418966908927, i32 1, i32 0)
  call void @_ZNSt8ios_base4InitC1Ev(ptr noundef nonnull align 1 dereferenceable(1) @_ZStL8__ioinit)
  %0 = call i32 @__cxa_atexit(ptr nonnull @_ZNSt8ios_base4InitD1Ev, ptr nonnull @_ZStL8__ioinit, ptr nonnull @__dso_handle) #11
  ret void
}

; Function Attrs: nounwind
declare void @llvm.instrprof.increment(ptr, i64, i32, i32) #11

; Function Attrs: nounwind
declare void @llvm.instrprof.value.profile(ptr, i64, i64, i32, i32) #11

attributes #0 = { "no-trapping-math"="true" "stack-protector-buffer-size"="8" "target-cpu"="x86-64" "target-features"="+cmov,+cx8,+fxsr,+mmx,+sse,+sse2,+x87" "tune-cpu"="generic" }
attributes #1 = { nounwind "no-trapping-math"="true" "stack-protector-buffer-size"="8" "target-cpu"="x86-64" "target-features"="+cmov,+cx8,+fxsr,+mmx,+sse,+sse2,+x87" "tune-cpu"="generic" }
attributes #2 = { nofree nounwind }
attributes #3 = { norecurse uwtable "min-legal-vector-width"="0" "no-trapping-math"="true" "stack-protector-buffer-size"="8" "target-cpu"="x86-64" "target-features"="+cmov,+cx8,+fxsr,+mmx,+sse,+sse2,+x87" "tune-cpu"="generic" }
attributes #4 = { mustprogress nocallback nofree nosync nounwind willreturn memory(argmem: readwrite) }
attributes #5 = { uwtable "min-legal-vector-width"="0" "no-trapping-math"="true" "stack-protector-buffer-size"="8" "target-cpu"="x86-64" "target-features"="+cmov,+cx8,+fxsr,+mmx,+sse,+sse2,+x87" "tune-cpu"="generic" }
attributes #6 = { mustprogress nofree nounwind willreturn "no-trapping-math"="true" "stack-protector-buffer-size"="8" "target-cpu"="x86-64" "target-features"="+cmov,+cx8,+fxsr,+mmx,+sse,+sse2,+x87" "tune-cpu"="generic" }
attributes #7 = { noreturn "no-trapping-math"="true" "stack-protector-buffer-size"="8" "target-cpu"="x86-64" "target-features"="+cmov,+cx8,+fxsr,+mmx,+sse,+sse2,+x87" "tune-cpu"="generic" }
attributes #8 = { mustprogress uwtable "min-legal-vector-width"="0" "no-trapping-math"="true" "stack-protector-buffer-size"="8" "target-cpu"="x86-64" "target-features"="+cmov,+cx8,+fxsr,+mmx,+sse,+sse2,+x87" "tune-cpu"="generic" }
attributes #9 = { nobuiltin allocsize(0) "no-trapping-math"="true" "stack-protector-buffer-size"="8" "target-cpu"="x86-64" "target-features"="+cmov,+cx8,+fxsr,+mmx,+sse,+sse2,+x87" "tune-cpu"="generic" }
attributes #10 = { nobuiltin nounwind "no-trapping-math"="true" "stack-protector-buffer-size"="8" "target-cpu"="x86-64" "target-features"="+cmov,+cx8,+fxsr,+mmx,+sse,+sse2,+x87" "tune-cpu"="generic" }
attributes #11 = { nounwind }
attributes #12 = { builtin nounwind }
attributes #13 = { noreturn }
attributes #14 = { builtin allocsize(0) }

!llvm.module.flags = !{!0, !1}
!llvm.ident = !{!2}

!0 = !{i32 1, !"wchar_size", i32 4}
!1 = !{i32 7, !"uwtable", i32 2}
!2 = !{!"clang version 18.0.0 (https://github.com/llvm/llvm-project.git 8605ff2f3981c876f13046683d1a8efc85fda34b)"}
!3 = !{!4, !4, i64 0}
!4 = !{!"any pointer", !5, i64 0}
!5 = !{!"omnipotent char", !6, i64 0}
!6 = !{!"Simple C++ TBAA"}
!7 = !{!8, !4, i64 0}
!8 = !{!"_ZTSNSt12_Vector_baseIiSaIiEE17_Vector_impl_dataE", !4, i64 0, !4, i64 8, !4, i64 16}
!9 = !{!10, !10, i64 0}
!10 = !{!"int", !5, i64 0}
!11 = distinct !{!11, !12}
!12 = !{!"llvm.loop.mustprogress"}
!13 = distinct !{!13, !12}
!14 = !{!15, !15, i64 0}
!15 = !{!"vtable pointer", !6, i64 0}
!16 = !{!8, !4, i64 8}
!17 = !{!8, !4, i64 16}
!18 = distinct !{!18, !12}
!19 = !{!"branch_weights", i32 1, i32 2000}
!20 = !{!21, !4, i64 240}
!21 = !{!"_ZTSSt9basic_iosIcSt11char_traitsIcEE", !22, i64 0, !4, i64 216, !5, i64 224, !28, i64 225, !4, i64 232, !4, i64 240, !4, i64 248, !4, i64 256}
!22 = !{!"_ZTSSt8ios_base", !23, i64 8, !23, i64 16, !24, i64 24, !25, i64 28, !25, i64 32, !4, i64 40, !26, i64 48, !5, i64 64, !10, i64 192, !4, i64 200, !27, i64 208}
!23 = !{!"long", !5, i64 0}
!24 = !{!"_ZTSSt13_Ios_Fmtflags", !5, i64 0}
!25 = !{!"_ZTSSt12_Ios_Iostate", !5, i64 0}
!26 = !{!"_ZTSNSt8ios_base6_WordsE", !4, i64 0, !23, i64 8}
!27 = !{!"_ZTSSt6locale", !4, i64 0}
!28 = !{!"bool", !5, i64 0}
!29 = !{!30, !5, i64 56}
!30 = !{!"_ZTSSt5ctypeIcE", !31, i64 0, !4, i64 16, !28, i64 24, !4, i64 32, !4, i64 40, !4, i64 48, !5, i64 56, !5, i64 57, !5, i64 313, !5, i64 569}
!31 = !{!"_ZTSNSt6locale5facetE", !10, i64 8}
!32 = !{!5, !5, i64 0}

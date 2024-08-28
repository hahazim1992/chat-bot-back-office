const HOME = "chatbots";

export function goBackOneLevel(router: { navigate: (arg0: string[], arg1: { relativeTo: any; }) => void; }, route: any): void {
  router.navigate(["../"], { relativeTo: route });
}

export function onClickBack(index: number, router: { navigate: (arg0: string[]) => void; }, route: any): void {
  if (index === 0) {
    router.navigate([HOME]);
  } else {
    goBackOneLevel(router, route);
  }
}


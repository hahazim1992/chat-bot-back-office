import { Component, OnInit, Input } from "@angular/core";

@Component({
  selector: "app-copy-right",
  templateUrl: "./copy-right.component.html",
  styleUrls: ["./copy-right.component.scss"]
})
export class CopyRightComponent implements OnInit {
  copyRightText: string | undefined;
  copyRightLoginText: string | undefined;

  ngOnInit(): void {
    const COPY_RIGHT_COMMON_TEXT = "All rights reserved. Copyright © 2023 CIMB Bank Berhad (13491-P)";
    const COPY_RIGHT_TEXT = "Copyright © 2023 CIMB Bank Berhad (13491-P)";
    this.copyRightText = COPY_RIGHT_COMMON_TEXT;
    this.copyRightLoginText = COPY_RIGHT_TEXT;
  }
}

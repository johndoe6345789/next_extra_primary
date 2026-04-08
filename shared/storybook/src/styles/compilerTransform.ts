/**
 * CSS transform value compilation.
 */

/** Axis translation value type. */
interface TranslateVal {
  value: number;
  unit: string;
}

/** Rotation value type. */
interface RotateVal {
  value: number;
  unit?: string;
}

/** Compile a transform value object to CSS. */
export function compileTransformValue(
  v: Record<string, unknown>,
): string {
  const transforms: string[] = [];
  const val = v.value as Record<string, unknown>;
  if (!val) return '';

  const ty = val.translateY as
    TranslateVal | undefined;
  if (ty) {
    transforms.push(
      `translateY(${ty.value}${ty.unit})`,
    );
  }

  const tx = val.translateX as
    TranslateVal | undefined;
  if (tx) {
    transforms.push(
      `translateX(${tx.value}${tx.unit})`,
    );
  }

  if (val.scale) {
    transforms.push(`scale(${val.scale})`);
  }

  const rot = val.rotate as
    RotateVal | undefined;
  if (rot) {
    transforms.push(
      `rotate(${rot.value}${rot.unit || 'deg'})`,
    );
  }

  return transforms.join(' ');
}

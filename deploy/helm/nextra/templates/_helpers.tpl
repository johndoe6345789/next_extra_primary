{{/*
Expand the name of the chart.
*/}}
{{- define "nextra.name" -}}
{{- default .Chart.Name .Values.nameOverride | trunc 63 | trimSuffix "-" -}}
{{- end -}}

{{/*
Fully qualified app name (release + chart).
*/}}
{{- define "nextra.fullname" -}}
{{- if .Values.fullnameOverride -}}
{{- .Values.fullnameOverride | trunc 63 | trimSuffix "-" -}}
{{- else -}}
{{- $name := default .Chart.Name .Values.nameOverride -}}
{{- printf "%s-%s" .Release.Name $name | trunc 63 | trimSuffix "-" -}}
{{- end -}}
{{- end -}}

{{/*
Chart label string (name-version).
*/}}
{{- define "nextra.chart" -}}
{{- printf "%s-%s" .Chart.Name .Chart.Version | replace "+" "_" -}}
{{- end -}}

{{/*
Common labels applied to every resource.
*/}}
{{- define "nextra.labels" -}}
helm.sh/chart: {{ include "nextra.chart" . }}
app.kubernetes.io/name: {{ include "nextra.name" . }}
app.kubernetes.io/instance: {{ .Release.Name }}
app.kubernetes.io/managed-by: {{ .Release.Service }}
app.kubernetes.io/version: {{ .Chart.AppVersion | quote }}
{{- end -}}

{{/*
Selector labels for a specific component.
Usage: {{ include "nextra.selectorLabels" (dict "ctx" . "component" "backend") }}
*/}}
{{- define "nextra.selectorLabels" -}}
app.kubernetes.io/name: {{ include "nextra.name" .ctx }}
app.kubernetes.io/instance: {{ .ctx.Release.Name }}
app.kubernetes.io/component: {{ .component }}
{{- end -}}

{{/*
Build a full image reference from registry/image/tag.
Usage: {{ include "nextra.image" (dict "ctx" . "image" "nextra-backend") }}
*/}}
{{- define "nextra.image" -}}
{{- $registry := .ctx.Values.global.imageRegistry -}}
{{- $tag := .ctx.Values.image.tag | default "latest" -}}
{{- printf "%s/%s:%s" $registry .image $tag -}}
{{- end -}}

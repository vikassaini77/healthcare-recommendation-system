import pytest
from src.services.safety_checker import SafetyChecker

@pytest.fixture
def checker():
    return SafetyChecker()

def test_allergy_rejection_direct_match(checker):
    safe_meds, rejected_meds = checker.check_allergies(["Aspirin", "Tylenol"], ["Aspirin"])
    assert safe_meds == ["Tylenol"]
    assert len(rejected_meds) == 1
    assert rejected_meds[0]["medication"] == "Aspirin"

def test_allergy_rejection_class_match(checker):
    safe_meds, rejected_meds = checker.check_allergies(["Amoxicillin", "Ibuprofen"], ["penicillin"])
    assert safe_meds == ["Ibuprofen"]
    assert len(rejected_meds) == 1
    assert rejected_meds[0]["medication"] == "Amoxicillin"
    assert "penicillin class" in rejected_meds[0]["reason"].lower()

def test_no_allergies(checker):
    safe_meds, rejected_meds = checker.check_allergies(["Ibuprofen", "Tylenol"], [])
    assert safe_meds == ["Ibuprofen", "Tylenol"]
    assert len(rejected_meds) == 0

def test_drug_interaction_critical(checker):
    safe_meds, warnings, critical_rejections = checker.check_interactions(["Aspirin"], ["Warfarin"])
    assert safe_meds == []
    assert len(critical_rejections) == 1
    assert critical_rejections[0]["medication"] == "Aspirin"
    assert "CRITICAL" in critical_rejections[0]["reason"]
    assert len(warnings) == 0

def test_drug_interaction_warning(checker):
    safe_meds, warnings, critical_rejections = checker.check_interactions(["Digoxin"], ["Amiodarone"])
    # Digoxin is safe to take but has a warning
    assert safe_meds == ["Digoxin"]
    assert len(warnings) == 1
    assert warnings[0]["medication"] == "Digoxin"
    assert "WARNING" in warnings[0]["warning"]
    assert len(critical_rejections) == 0

def test_safe_medication(checker):
    safe_meds, warnings, critical_rejections = checker.check_interactions(["Tylenol"], ["Amiodarone"])
    assert safe_meds == ["Tylenol"]
    assert len(warnings) == 0
    assert len(critical_rejections) == 0

def test_unknown_medication(checker):
    # Unknown medications are considered safe by default
    safe_meds, warnings, critical_rejections = checker.check_interactions(["MagicDrug"], ["UnknownDrug"])
    assert safe_meds == ["MagicDrug"]
    assert len(warnings) == 0
    assert len(critical_rejections) == 0

def test_multiple_interactions(checker):
    candidate = ["Aspirin", "Digoxin"]
    current = ["Warfarin", "Amiodarone"]
    safe_meds, warnings, critical_rejections = checker.check_interactions(candidate, current)
    
    assert safe_meds == ["Digoxin"]
    
    assert len(critical_rejections) == 1
    assert critical_rejections[0]["medication"] == "Aspirin"
    
    assert len(warnings) == 1
    assert warnings[0]["medication"] == "Digoxin"
